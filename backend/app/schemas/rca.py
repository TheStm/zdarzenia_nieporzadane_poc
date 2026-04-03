from datetime import datetime, date

from pydantic import BaseModel, Field

from app.models.rca import ActionStatus, RCAStatus


class RCACreate(BaseModel):
    description: str | None = None
    team_members: str | None = None


class RCARead(BaseModel):
    id: int
    incident_id: int
    status: RCAStatus
    description: str | None
    root_causes: str | None
    contributing_factors: str | None
    recommendations: str | None
    team_members: str | None
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class RCAUpdate(BaseModel):
    status: RCAStatus | None = None
    description: str | None = None
    root_causes: str | None = None
    contributing_factors: str | None = None
    recommendations: str | None = None
    team_members: str | None = None


class ActionItemCreate(BaseModel):
    description: str = Field(min_length=1)
    responsible_person: str = Field(min_length=1, max_length=200)
    responsible_user_id: int | None = None
    deadline: date


class ActionItemRead(BaseModel):
    id: int
    rca_id: int
    description: str
    responsible_person: str
    responsible_user_id: int | None
    deadline: date
    status: ActionStatus
    completion_notes: str | None
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class ActionItemUpdate(BaseModel):
    description: str | None = None
    responsible_person: str | None = None
    responsible_user_id: int | None = None
    deadline: date | None = None
    status: ActionStatus | None = None
    completion_notes: str | None = None
