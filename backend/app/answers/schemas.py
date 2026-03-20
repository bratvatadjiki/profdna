from pydantic import BaseModel


class SaveAnswerRequest(BaseModel):
    question_id: int
    value_text: str | None = None
    value_json: dict | list | None = None


class SaveAnswerResponse(BaseModel):
    session_id: int
    question_id: int
    saved: bool
    answered_count: int
    total_questions: int
    progress_percent: int
