from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.answers.models import SessionAnswer


class AnswerRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_session_and_question(self, session_id: int, question_id: int) -> SessionAnswer | None:
        stmt = select(SessionAnswer).where(
            SessionAnswer.session_id == session_id,
            SessionAnswer.question_id == question_id,
        )
        return self.db.scalar(stmt)

    def create(
        self,
        session_id: int,
        question_id: int,
        value_text: str | None = None,
        value_json: dict | list | None = None,
    ) -> SessionAnswer:
        obj = SessionAnswer(
            session_id=session_id,
            question_id=question_id,
            value_text=value_text,
            value_json=value_json,
        )
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def save(self, answer_obj: SessionAnswer) -> SessionAnswer:
        self.db.add(answer_obj)
        self.db.commit()
        self.db.refresh(answer_obj)
        return answer_obj

    def count_answered(self, session_id: int) -> int:
        stmt = (
            select(func.count(SessionAnswer.id))
            .where(SessionAnswer.session_id == session_id)
        )
        result = self.db.scalar(stmt)
        return int(result or 0)

    def list_by_session(self, session_id: int) -> list[SessionAnswer]:
        stmt = select(SessionAnswer).where(SessionAnswer.session_id == session_id)
        return list(self.db.scalars(stmt).all())