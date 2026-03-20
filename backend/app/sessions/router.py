from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.answers.repository import AnswerRepository
from app.answers.schemas import SaveAnswerRequest
from app.answers.service import AnswerService
from app.db.session import get_db
from app.metrics.service import MetricsService
from app.sessions.repository import SessionRepository
from app.sessions.schemas import SessionStartRequest
from app.sessions.service import SessionService


router = APIRouter(tags=["sessions"])


def get_session_service(db: Session) -> SessionService:
    session_repo = SessionRepository(db)
    return SessionService(session_repo=session_repo)


def get_answer_service(db: Session) -> AnswerService:
    session_repo = SessionRepository(db)
    answer_repo = AnswerRepository(db)
    return AnswerService(
        answer_repo=answer_repo,
        session_repo=session_repo,
    )


def get_metrics_service(db: Session) -> MetricsService:
    session_repo = SessionRepository(db)
    answer_repo = AnswerRepository(db)
    return MetricsService(
        answer_repo=answer_repo,
        session_repo=session_repo,
    )


@router.get("/sessions/health")
def sessions_health():
    return {"ok": True, "module": "sessions"}


@router.post("/public/tests/{token}/start")
def start_session(
    token: str,
    payload: SessionStartRequest,
    db: Session = Depends(get_db),
):
    try:
        service = get_session_service(db)

        # Временно используем test_id=1 и total_questions=10,
        # пока не подключили реальный поиск теста по token.
        result = service.start_session(
            test_id=1,
            public_token=token,
            total_questions=10,
            payload=payload,
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/public/sessions/{session_id}/answer")
def save_answer(
    session_id: int,
    payload: SaveAnswerRequest,
    db: Session = Depends(get_db),
):
    try:
        service = get_answer_service(db)
        return service.save_answer(session_id, payload)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/sessions/{session_id}/metrics")
def get_session_metrics(
    session_id: int,
    db: Session = Depends(get_db),
):
    try:
        service = get_metrics_service(db)
        return service.calculate_session_metrics(session_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))