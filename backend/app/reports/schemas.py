from pydantic import BaseModel


class ReportContext(BaseModel):
    session_id: int
    participant_name: str | None = None
    participant_email: str | None = None
    test_title: str
    session_status: str
    answered_count: int
    total_questions: int
    progress_percent: int
    metrics: dict
    answers: list[dict]