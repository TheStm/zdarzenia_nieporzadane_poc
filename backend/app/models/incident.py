import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Integer, String, Text, Boolean, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class EventType(str, enum.Enum):
    HARMFUL = "ZN"
    NO_HARM = "ZN-0"
    NEAR_MISS = "NZN"


class Category(str, enum.Enum):
    CLINICAL_PROCEDURES = "A"
    MEDICATION = "B"
    INFECTION = "C"
    MEDICAL_DEVICE = "D"
    FALLS = "E"
    PRESSURE_ULCERS = "F"
    BLOOD = "G"
    PATIENT_CARE = "H"
    DOCUMENTATION = "I"
    SELF_HARM_BEHAVIOR = "J"
    INFRASTRUCTURE = "K"
    WORK_ORGANIZATION = "L"
    PATIENT_RIGHTS = "M"
    OTHER = "X"


class Severity(int, enum.Enum):
    NONE = 0
    MINIMAL = 1
    MODERATE = 2
    SEVERE = 3
    CRITICAL = 4


class Status(str, enum.Enum):
    NEW = "new"
    IN_TRIAGE = "in_triage"
    REJECTED = "rejected"
    IN_ANALYSIS = "in_analysis"
    ESCALATED_RCA = "escalated_rca"
    ACTION_PLAN = "action_plan"
    IMPLEMENTING = "implementing"
    CLOSED = "closed"


class Incident(Base):
    __tablename__ = "incidents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)

    # Event basics
    event_type: Mapped[str] = mapped_column(Enum(EventType), nullable=False)
    event_date: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    department: Mapped[str] = mapped_column(String(200), nullable=False)
    location: Mapped[str | None] = mapped_column(String(200), nullable=True)

    # Classification
    category: Mapped[str] = mapped_column(Enum(Category), nullable=False)
    subcategory: Mapped[str | None] = mapped_column(String(200), nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    severity: Mapped[int] = mapped_column(Enum(Severity), nullable=False)

    # Immediate actions
    immediate_actions_taken: Mapped[bool] = mapped_column(Boolean, default=False)
    immediate_actions_desc: Mapped[str | None] = mapped_column(Text, nullable=True)
    preventive_suggestions: Mapped[str | None] = mapped_column(Text, nullable=True)

    # Patient data (optional)
    patient_age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    patient_sex: Mapped[str | None] = mapped_column(String(10), nullable=True)

    # Reporter (linked to user)
    reporter_user_id: Mapped[int | None] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=True
    )

    # Reporter (text fields, kept for backward compat and anonymous reports)
    reporter_anonymous: Mapped[bool] = mapped_column(Boolean, default=False)
    reporter_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    reporter_role: Mapped[str | None] = mapped_column(String(100), nullable=True)

    # Workflow
    status: Mapped[str] = mapped_column(
        Enum(Status), nullable=False, default=Status.NEW
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
