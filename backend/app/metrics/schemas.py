from pydantic import BaseModel


class ScaleMetric(BaseModel):
    key: str
    title: str
    raw_score: float
    normalized_score: float
    interpretation: str


class SessionMetricsResponse(BaseModel):
    session_id: int
    summary: dict
    scales: list[ScaleMetric]