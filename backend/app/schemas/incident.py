from datetime import datetime

from pydantic import BaseModel, Field

from app.models.incident import Category, EventType, Severity, Status


class IncidentCreate(BaseModel):
    event_type: EventType
    event_date: datetime
    department: str = Field(min_length=1, max_length=200)
    location: str | None = None
    category: Category
    subcategory: str | None = None
    description: str = Field(min_length=50, max_length=5000)
    severity: Severity
    immediate_actions_taken: bool = False
    immediate_actions_desc: str | None = None
    preventive_suggestions: str | None = None
    patient_age: int | None = Field(default=None, ge=0, le=150)
    patient_sex: str | None = None
    reporter_anonymous: bool = False
    reporter_name: str | None = None
    reporter_role: str | None = None


class IncidentRead(BaseModel):
    id: int
    event_type: EventType
    event_date: datetime
    department: str
    location: str | None
    category: Category
    subcategory: str | None
    description: str
    severity: Severity
    immediate_actions_taken: bool
    immediate_actions_desc: str | None
    preventive_suggestions: str | None
    patient_age: int | None
    patient_sex: str | None
    reporter_user_id: int | None
    reporter_anonymous: bool
    reporter_name: str | None
    reporter_role: str | None
    status: Status
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class IncidentListItem(BaseModel):
    id: int
    event_type: EventType
    event_date: datetime
    department: str
    category: Category
    severity: Severity
    status: Status
    reporter_user_id: int | None
    created_at: datetime

    model_config = {"from_attributes": True}


class IncidentStatusUpdate(BaseModel):
    status: Status


class IncidentListResponse(BaseModel):
    items: list[IncidentListItem]
    total: int
