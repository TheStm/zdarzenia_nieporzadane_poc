import enum
from datetime import datetime, date

from sqlalchemy import DateTime, Date, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RCAStatus(str, enum.Enum):
    DRAFT = "draft"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"


class ActionStatus(str, enum.Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    OVERDUE = "overdue"


class RCAAnalysis(Base):
    __tablename__ = "rca_analyses"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    incident_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("incidents.id"), nullable=False, unique=True
    )

    status: Mapped[str] = mapped_column(
        Enum(RCAStatus), nullable=False, default=RCAStatus.DRAFT
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    root_causes: Mapped[str | None] = mapped_column(Text, nullable=True)
    contributing_factors: Mapped[str | None] = mapped_column(Text, nullable=True)
    recommendations: Mapped[str | None] = mapped_column(Text, nullable=True)
    team_members: Mapped[str | None] = mapped_column(String(500), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    incident = relationship("Incident", backref="rca_analysis")
    action_items = relationship("ActionItem", back_populates="rca", cascade="all, delete-orphan")


class ActionItem(Base):
    __tablename__ = "action_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    rca_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("rca_analyses.id"), nullable=False
    )

    description: Mapped[str] = mapped_column(Text, nullable=False)
    responsible_person: Mapped[str] = mapped_column(String(200), nullable=False)
    deadline: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(
        Enum(ActionStatus), nullable=False, default=ActionStatus.TODO
    )
    completion_notes: Mapped[str | None] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    rca = relationship("RCAAnalysis", back_populates="action_items")
