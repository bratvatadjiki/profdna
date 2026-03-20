from app.sessions.repository import SessionRepository
from app.sessions.schemas import SessionStartRequest


def calc_progress(answered_count: int, total_questions: int) -> int:
    if total_questions <= 0:
        return 0
    return int((answered_count / total_questions) * 100)


class SessionService:
    def __init__(self, session_repo: SessionRepository):
        self.session_repo = session_repo

    def start_session(
        self,
        test_id: int,
        public_token: str,
        total_questions: int,
        payload: SessionStartRequest,
    ):
        session_obj = self.session_repo.create(
            test_id=test_id,
            public_token=public_token,
            participant_name=payload.participant_name,
            participant_email=payload.participant_email,
            status="in_progress",
            answered_count=0,
            total_questions=total_questions,
        )
        return {
            "id": session_obj.id,
            "status": session_obj.status,
            "started_at": session_obj.started_at,
            "finished_at": session_obj.finished_at,
            "answered_count": session_obj.answered_count,
            "total_questions": session_obj.total_questions,
            "progress_percent": calc_progress(
                session_obj.answered_count,
                session_obj.total_questions,
            ),
        }

    def get_progress(self, session_id: int):
        session_obj = self.session_repo.get_by_id(session_id)
        if not session_obj:
            raise ValueError("Session not found")

        return {
            "id": session_obj.id,
            "status": session_obj.status,
            "started_at": session_obj.started_at,
            "finished_at": session_obj.finished_at,
            "answered_count": session_obj.answered_count,
            "total_questions": session_obj.total_questions,
            "progress_percent": calc_progress(
                session_obj.answered_count,
                session_obj.total_questions,
            ),
        }