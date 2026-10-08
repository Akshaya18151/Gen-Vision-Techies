import logging
from app.config import settings
from app.ai.base import BaseAIProvider
from app.ai.qwen_provider import QwenOllamaProvider, QwenDashScopeProvider
from app.ai.heuristic_provider import HeuristicProvider

logger = logging.getLogger(__name__)


class AIFactory:
    """
    Modular AI Provider Factory.
    Enables swapping between Qwen3 (local open-weight via Ollama),
    hosted Qwen (Alibaba Cloud DashScope), and zero-latency heuristics,
    keeping providers completely pluggable.
    """

    @staticmethod
    def get_provider(provider_name: str = None, model_name: str = None) -> BaseAIProvider:
        target_provider = (provider_name or settings.AI_PROVIDER).lower()

        if target_provider in ("qwen", "qwen3", "qwen_ollama", "ollama"):
            return QwenOllamaProvider(model=model_name or settings.QWEN_MODEL)
        elif target_provider in ("qwen_dashscope", "qwen_cloud", "dashscope"):
            return QwenDashScopeProvider(model=model_name or settings.QWEN_MODEL)
        elif target_provider == "heuristic":
            return HeuristicProvider()
        else:
            logger.warning(f"Unknown provider '{target_provider}', defaulting to Qwen3 local open-weight provider.")
            return QwenOllamaProvider(model=model_name or settings.QWEN_MODEL)

    @staticmethod
    async def get_active_provider_with_fallback(preferred_model: str = None) -> BaseAIProvider:
        """
        Attempts to instantiate primary provider (Qwen3).
        If user explicitly asks for heuristic or if primary is offline,
        seamlessly falls back to HeuristicProvider to guarantee zero downtime.
        """
        if preferred_model == "heuristic":
            return HeuristicProvider()

        primary = AIFactory.get_provider(model_name=preferred_model)
        try:
            if await primary.is_available():
                return primary
        except Exception as e:
            logger.warning(f"Primary Qwen AI provider check failed: {e}")

        logger.info("Using Heuristic Threat Engine fallback for instant response.")
        return HeuristicProvider()
