from app.answers.repository import AnswerRepository
from app.metrics.service import MetricsService
from app.reports.docx_renderer import render_client_docx, render_pro_docx
from app.reports.html_renderer import render_html_report
from app.sessions.repository import SessionRepository
from app.sessions.service import calc_progress


class ReportService:
    def __init__(
        self,
        session_repo: SessionRepository,
        answer_repo: AnswerRepository,
        metrics_service: MetricsService,
    ):
        self.session_repo = session_repo
        self.answer_repo = answer_repo
        self.metrics_service = metrics_service

    def build_report_context(self, session_id: int) -> dict:
        session_obj = self.session_repo.get_by_id(session_id)
        if not session_obj:
            raise ValueError("Session not found")

        answers = self.answer_repo.list_by_session(session_id)
        metrics = self.metrics_service.calculate_session_metrics(session_id)

        answer_items = []
        for answer in answers:
            answer_items.append(
                {
                    "id": answer.id,
                    "question_id": answer.question_id,
                    "value_text": answer.value_text,
                    "value_json": answer.value_json,
                }
            )

        context = {
            "session_id": session_obj.id,
            "participant_name": session_obj.participant_name,
            "participant_email": session_obj.participant_email,
            "test_title": f"Test #{session_obj.test_id}",
            "session_status": session_obj.status,
            "answered_count": session_obj.answered_count,
            "total_questions": session_obj.total_questions,
            "progress_percent": calc_progress(
                session_obj.answered_count,
                session_obj.total_questions,
            ),
            "metrics": metrics,
            "answers": answer_items,
        }
        return context

    def render_client_html(self, session_id: int) -> str:
        context = self.build_report_context(session_id)
        return render_html_report("client_report.html", context)

    def render_pro_html(self, session_id: int) -> str:
        context = self.build_report_context(session_id)
        return render_html_report("pro_report.html", context)

    def render_client_docx(self, session_id: int):
        context = self.build_report_context(session_id)
        return render_client_docx(context)

    def render_pro_docx(self, session_id: int):
        context = self.build_report_context(session_id)
        return render_pro_docx(context)