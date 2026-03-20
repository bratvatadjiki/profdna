from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.common.enums import QuestionType, SessionStatus, TestStatus


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class TestRead(BaseSchema):
    id: UUID
    slug: str
    title: str
    description: str | None = None
    status: TestStatus
    time_limit_sec: int | None = None
    created_at: datetime


class QuestionRead(BaseSchema):
    id: UUID
    test_id: UUID
    code: str
    type: QuestionType
    title: str
    description: str | None = None
    order_index: int
    is_required: bool
    config: dict[str, Any]


class SessionCreate(BaseModel):
    test_id: UUID
    test_link_token: str | None = None
    user_id: UUID | None = None


class SessionRead(BaseSchema):
    id: UUID
    status: SessionStatus
    started_at: datetime
