from datetime import datetime

from pydantic import BaseModel


class NotificationRead(BaseModel):
    id: int
    type: str
    title: str
    message: str
    link: str | None
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationListResponse(BaseModel):
    items: list[NotificationRead]
    unread_count: int


class UnreadCountResponse(BaseModel):
    unread_count: int
