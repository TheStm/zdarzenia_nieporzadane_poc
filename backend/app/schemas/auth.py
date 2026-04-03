from datetime import datetime

from pydantic import BaseModel, Field

from app.models.user import Role


class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserCreate(BaseModel):
    email: str
    password: str = Field(min_length=8)
    full_name: str = Field(min_length=1, max_length=200)
    role: Role = Role.REPORTER


class UserRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: Role
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}
