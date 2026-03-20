from fastapi import APIRouter, Depends
import fastapi.responses
from sqlalchemy.orm import Session

from app.answers.repository import AnswerRepository
from app.db.session import get_db
from app.metrics.service import MetricsService
from app.reports.service import ReportService
from app.sessions.repository import SessionRepository


router = APIRouter(prefix="/sessions", tags=["reports"])


def get_report_service(db: Session) -> ReportService:
    session_repo = SessionRepository(db)
    answer_repo = AnswerRepository(db)
    metrics_service = MetricsService(
        answer_repo=answer_repo,
        session_repo=session_repo,
    )
    return ReportService(
        session_repo=session_repo,
        answer_repo=answer_repo,
        metrics_service=metrics_service,
    )


@router.get("/{session_id}/report/client/html", response_class=fastapi.responses.HTMLResponse)
def get_client_html_report(
    session_id: int,
    db: Session = Depends(get_db),
):
    service = get_report_service(db)
    html = service.render_client_html(session_id)
    return fastapi.responses.HTMLResponse(content=html)


@router.get("/{session_id}/report/pro/html", response_class=fastapi.responses.HTMLResponse)
def get_pro_html_report(
    session_id: int,
    db: Session = Depends(get_db),
):
    service = get_report_service(db)
    html = service.render_pro_html(session_id)
    return fastapi.responses.HTMLResponse(content=html)


@router.get("/{session_id}/report/client/docx")
def get_client_docx_report(
    session_id: int,
    db: Session = Depends(get_db),
):
    service = get_report_service(db)
    stream = service.render_client_docx(session_id)

    return fastapi.responses.StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="client-report-{session_id}.docx"'
        },
    )


@router.get("/{session_id}/report/pro/docx")
def get_pro_docx_report(
    session_id: int,
    db: Session = Depends(get_db),
):
    service = get_report_service(db)
    stream = service.render_pro_docx(session_id)

    return fastapi.responses.StreamingResponse(
        stream,
        media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        headers={
            "Content-Disposition": f'attachment; filename="pro-report-{session_id}.docx"'
        },
    )