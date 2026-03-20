from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.common.responses import success_response
from app.core.config import settings
from app.core.exceptions import register_exception_handlers
from app.core.logging import setup_logging

setup_logging(settings.LOG_LEVEL)

app = FastAPI(title=settings.PROJECT_NAME)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_exception_handlers(app)


@app.get("/health")
def healthcheck():
    return success_response({"status": "ok", "service": settings.PROJECT_NAME})


@app.get(f"{settings.API_V1_PREFIX}/tests/{{slug}}")
def get_test(slug: str):
    return success_response(
        {
            "id": "00000000-0000-0000-0000-000000000000",
            "slug": slug,
            "title": "Draft test",
            "description": "Stub response for frontend integration",
            "status": "draft",
            "time_limit_sec": 1800,
            "questions": [],
        }
    )
