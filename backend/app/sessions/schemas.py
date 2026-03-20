from datetime import datetime

from pydantic import BaseModel, EmailStr


class SessionStartRequest(BaseModel):
    participant_name: str | None = None
    participant_email: EmailStr | None = None


class SessionProgressResponse(BaseModel):
    id: int
    status: str
    started_at: datetime
    finished_at: datetime | None = None
    answered_count: int
    total_questions: int
    progress_percent: int
