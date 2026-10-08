"""
Backward compatibility alias for OllamaProvider pointing to QwenOllamaProvider.
"""
from app.ai.qwen_provider import QwenOllamaProvider as OllamaProvider

__all__ = ["OllamaProvider"]
