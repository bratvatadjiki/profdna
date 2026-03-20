from app.answers.repository import AnswerRepository
from app.answers.schemas import SaveAnswerRequest
from app.sessions.repository import SessionRepository
from app.sessions.service import calc_progress


class AnswerService:
    def __init__(
        self,
        answer_repo: AnswerRepository,
        session_repo: SessionRepository,
    ):
        self.answer_repo = answer_repo
        self.session_repo = session_repo

    def save_answer(self, session_id: int, payload: SaveAnswerRequest):
        session_obj = self.session_repo.get_by_id(session_id)
        if not session_obj:
            raise ValueError("Session not found")

        if session_obj.status != "in_progress":
            raise ValueError("Session is not in progress")

        answer_obj = self.answer_repo.get_by_session_and_question(
            session_id=session_id,
            question_id=payload.question_id,
        )

        if answer_obj:
            answer_obj.value_text = payload.value_text
            answer_obj.value_json = payload.value_json
            self.answer_repo.save(answer_obj)
        else:
            self.answer_repo.create(
                session_id=session_id,
                question_id=payload.question_id,
                value_text=payload.value_text,
                value_json=payload.value_json,
            )

        answered_count = self.answer_repo.count_answered(session_id)
        session_obj.answered_count = answered_count
        self.session_repo.save(session_obj)

        return {
            "session_id": session_obj.id,
            "question_id": payload.question_id,
            "saved": True,
            "answered_count": session_obj.answered_count,
            "total_questions": session_obj.total_questions,
            "progress_percent": calc_progress(
                session_obj.answered_count,
                session_obj.total_questions,
            ),
        }