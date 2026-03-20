from sqlalchemy import select
from sqlalchemy.orm import Session

from app.sessions.models import TestSession


class SessionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, **kwargs) -> TestSession:
        obj = TestSession(**kwargs)
        self.db.add(obj)
        self.db.commit()
        self.db.refresh(obj)
        return obj

    def get_by_id(self, session_id: int) -> TestSession | None:
        stmt = select(TestSession).where(TestSession.id == session_id)
        return self.db.scalar(stmt)

    def save(self, session_obj: TestSession) -> TestSession:
        self.db.add(session_obj)
        self.db.commit()
        self.db.refresh(session_obj)
        return session_obj