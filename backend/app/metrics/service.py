from app.answers.repository import AnswerRepository
from app.metrics.formulas import apply_score_map
from app.metrics.utils import (
    build_summary,
    interpret_score,
    normalize_score,
    prettify_scale_title,
)
from app.sessions.repository import SessionRepository


class MetricsService:
    def __init__(
        self,
        answer_repo: AnswerRepository,
        session_repo: SessionRepository,
    ):
        self.answer_repo = answer_repo
        self.session_repo = session_repo

    def calculate_session_metrics(self, session_id: int) -> dict:
        session_obj = self.session_repo.get_by_id(session_id)
        if not session_obj:
            raise ValueError("Session not found")

        answers = self.answer_repo.list_by_session(session_id)

        raw_scores: dict[str, float] = {}

        for answer in answers:
            if not answer.value_json:
                continue

            if not isinstance(answer.value_json, dict):
                continue

            score_map = answer.value_json.get("score_map")
            if not score_map:
                continue

            if not isinstance(score_map, dict):
                continue

            apply_score_map(raw_scores, score_map)

        scales = []
        for scale_key, raw_score in raw_scores.items():
            normalized_score = normalize_score(raw_score)
            interpretation = interpret_score(normalized_score)

            scales.append(
                {
                    "key": scale_key,
                    "title": prettify_scale_title(scale_key),
                    "raw_score": raw_score,
                    "normalized_score": normalized_score,
                    "interpretation": interpretation,
                }
            )

        scales = sorted(
            scales,
            key=lambda item: item["normalized_score"],
            reverse=True,
        )

        summary = build_summary(scales)

        return {
            "session_id": session_id,
            "summary": summary,
            "scales": scales,
        }