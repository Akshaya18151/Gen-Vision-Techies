from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging

from app.config import settings
from app.schemas import HealthResponse
from app.routes.analyze import router as analyze_router

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("scamshield")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="ScamShield API - Open-Weight AI Scam & Threat Detection Engine"
)

# CORS setup for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router)


@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "operational",
        "model": settings.QWEN_MODEL,
        "provider": settings.AI_PROVIDER,
        "docs": "/docs"
    }


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    qwen_ok = False
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            qwen_ok = res.status_code == 200
    except Exception:
        qwen_ok = False

    return HealthResponse(
        status="healthy",
        service="ScamShield Backend",
        active_provider=settings.AI_PROVIDER,
        model=settings.QWEN_MODEL,
        ollama_available=qwen_ok
    )
