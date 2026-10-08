import logging
from fastapi import APIRouter, HTTPException
from app.schemas import AnalyzeRequest, ScamAnalysisResult
from app.ai.factory import AIFactory
from app.ai.heuristic_provider import HeuristicProvider

router = APIRouter(prefix="/api", tags=["Analysis"])
logger = logging.getLogger(__name__)

EXAMPLE_MESSAGES = [
    {
        "id": "safe",
        "title": "Legitimate Notification",
        "tag": "Safe Example",
        "preview": "Appointment reminder from healthcare clinic",
        "content": "Hi Alex, your doctor appointment with Dr. Henderson is confirmed for tomorrow at 3:00 PM at Main Medical Clinic (Suite 204). Reply CANCEL if you need to reschedule."
    },
    {
        "id": "suspicious",
        "title": "Suspicious Account Alert",
        "tag": "Suspicious Example",
        "preview": "Unverified security alert with shortened link",
        "content": "Amazon Alert: Unusual sign-in attempt detected from IP 192.168.1.1. If this was not you, confirm your identity here: bit.ly/amz-verify-session"
    },
    {
        "id": "high_risk",
        "title": "Urgent Impersonation & Extortion",
        "tag": "High-Risk Example",
        "preview": "Law enforcement threat demanding crypto payment",
        "content": "URGENT: IRS Final Notice! Your tax return has an unpaid balance of $4,850. A federal arrest warrant will be issued in 24 hours. Call 1-800-555-0199 immediately or settle via Bitcoin to avoid detention."
    }
]


@router.post("/analyze", response_model=ScamAnalysisResult)
async def analyze_message(request: AnalyzeRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    provider = await AIFactory.get_active_provider_with_fallback(request.preferred_model)
    
    try:
        result = await provider.analyze(request.message)
        return result
    except Exception as e:
        logger.error(f"Primary provider error: {e}. Executing heuristic fallback...", exc_info=True)
        # Fallback to heuristic to never fail the user in demo
        fallback = HeuristicProvider()
        result = await fallback.analyze(request.message)
        result.explanation = f"(Fallback Analysis) {result.explanation}"
        return result


@router.get("/examples")
async def get_examples():
    """Returns curated example messages for quick testing."""
    return EXAMPLE_MESSAGES
