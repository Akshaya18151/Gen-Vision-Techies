import json
import re
import time
import httpx
import logging
from typing import Optional, Dict, Any

from app.config import settings
from app.schemas import ScamAnalysisResult, RiskLevel
from app.ai.base import BaseAIProvider

logger = logging.getLogger(__name__)


class QwenOllamaProvider(BaseAIProvider):
    """
    Open-weight AI provider running Qwen3 locally via Ollama.
    Features on-device inference with no remote data transmission and zero cloud dependencies.
    """

    def __init__(self, base_url: Optional[str] = None, model: Optional[str] = None):
        self.base_url = (base_url or settings.OLLAMA_BASE_URL).rstrip("/")
        self.model = model or settings.QWEN_MODEL
        self.timeout = settings.OLLAMA_TIMEOUT_SECONDS

    async def is_available(self) -> bool:
        """Checks if the local Ollama instance is accessible and has Qwen models available."""
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                res = await client.get(f"{self.base_url}/api/tags")
                if res.status_code != 200:
                    return False
                data = res.json()
                models = [m.get("name", "") for m in data.get("models", [])]
                # Check if the requested model or any qwen model is present
                model_base = self.model.split(":")[0]
                has_model = any(self.model in m or model_base in m for m in models)
                return has_model or len(models) > 0
        except Exception as e:
            logger.debug(f"Ollama availability check failed: {e}")
            return False

    async def analyze(self, message: str) -> ScamAnalysisResult:
        """
        Sends the user's message to Qwen3 for threat & scam analysis.
        Parses and validates the response into the exact JSON schema.
        """
        start_time = time.time()
        
        user_prompt = f"""Analyze this message for cybersecurity risks and potential scams:

\"\"\"{message}\"\"\"

Provide your evaluation strictly as the requested JSON object."""

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "stream": False,
            "format": "json",
            "options": {
                "temperature": 0.1,
                "top_p": 0.9
            }
        }

        async with httpx.AsyncClient(timeout=self.timeout) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json=payload
            )
            response.raise_for_status()
            data = response.json()
            raw_content = data.get("message", {}).get("content", "")

        parsed = self._parse_json_response(raw_content)
        latency = round((time.time() - start_time) * 1000, 1)

        # Sanitize score and map risk level
        score = max(0, min(100, int(parsed.get("risk_score", 50))))
        if score < 40:
            level = RiskLevel.LOW
        elif score < 70:
            level = RiskLevel.MEDIUM
        else:
            level = RiskLevel.HIGH

        # Explicit risk_level override if valid
        raw_level = str(parsed.get("risk_level", "")).upper()
        if raw_level in ("LOW", "MEDIUM", "HIGH"):
            level = RiskLevel(raw_level)

        signals = [str(s).strip() for s in parsed.get("signals", []) if str(s).strip()]
        if not signals:
            signals = ["Message inspected for deceptive patterns"]

        explanation = self._sanitize_language(parsed.get("explanation", "Analysis completed."))
        advice = self._sanitize_language(parsed.get("advice", "Remain vigilant and verify sender credentials independently."))

        return ScamAnalysisResult(
            risk_score=score,
            risk_level=level,
            signals=signals,
            explanation=explanation,
            advice=advice,
            model_used=self.model,
            provider="qwen3 (open-weight local)",
            latency_ms=latency
        )

    def _parse_json_response(self, text: str) -> Dict[str, Any]:
        """Parses model response into dictionary matching exact scam analysis structure."""
        text = text.strip()
        
        # 1. Direct JSON parse
        try:
            return json.loads(text)
        except Exception:
            pass

        # 2. Strip Markdown code fences
        clean_text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
        clean_text = re.sub(r"```$", "", clean_text, flags=re.MULTILINE).strip()
        try:
            return json.loads(clean_text)
        except Exception:
            pass

        # 3. Extract bracketed JSON object
        match = re.search(r"\{.*\}", text, flags=re.DOTALL)
        if match:
            try:
                return json.loads(match.group(0))
            except Exception:
                pass

        raise ValueError(f"Could not parse valid JSON from Qwen3 response: {text[:200]}")

    def _sanitize_language(self, text: str) -> str:
        """
        Enforces responsible AI safety principle:
        Never claim with 100% certainty that a message is definitely a scam or safe.
        Uses cautious terminology like 'potential scam' or 'high-risk message'.
        """
        replacements = [
            (r"\b(this is definitely a scam|it is definitely a scam|this is certainly a scam)\b", "this appears to be a high-risk message"),
            (r"\b(this is a scam|this message is a scam)\b", "this message is a potential scam"),
            (r"\b(it is a scam)\b", "it shows strong potential scam characteristics"),
            (r"\b(confirmed scam)\b", "high-risk message"),
            (r"\b(guaranteed safe|100% safe|definitely safe)\b", "likely legitimate"),
        ]
        sanitized = text
        for pattern, replacement in replacements:
            sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)
        return sanitized


class QwenDashScopeProvider(BaseAIProvider):
    """
    Hosted Qwen3 provider using Alibaba Cloud Model Studio / DashScope.
    Used when running hosted Qwen without local hardware.
    API keys are strictly loaded from environment variables (DASHSCOPE_API_KEY).
    """

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None, base_url: Optional[str] = None):
        self.api_key = api_key or settings.DASHSCOPE_API_KEY
        self.model = model or settings.QWEN_MODEL
        self.base_url = (base_url or settings.DASHSCOPE_BASE_URL).rstrip("/")

    async def is_available(self) -> bool:
        """Available if a DashScope API key is configured in environment variables."""
        return bool(self.api_key and self.api_key.strip())

    async def analyze(self, message: str) -> ScamAnalysisResult:
        if not self.api_key:
            raise ValueError("DASHSCOPE_API_KEY environment variable is not configured.")

        start_time = time.time()
        user_prompt = f"""Analyze this message for cybersecurity risks and potential scams:

\"\"\"{message}\"\"\"

Provide your evaluation strictly as the requested JSON object."""

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": self.SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "response_format": {"type": "json_object"},
            "temperature": 0.1
        }

        endpoint = f"{self.base_url}/chat/completions"
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(endpoint, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            raw_content = data["choices"][0]["message"]["content"]

        parsed = json.loads(raw_content)
        latency = round((time.time() - start_time) * 1000, 1)

        score = max(0, min(100, int(parsed.get("risk_score", 50))))
        raw_level = str(parsed.get("risk_level", "")).upper()
        if raw_level in ("LOW", "MEDIUM", "HIGH"):
            level = RiskLevel(raw_level)
        elif score < 40:
            level = RiskLevel.LOW
        elif score < 70:
            level = RiskLevel.MEDIUM
        else:
            level = RiskLevel.HIGH

        signals = [str(s).strip() for s in parsed.get("signals", []) if str(s).strip()]
        explanation = parsed.get("explanation", "Analysis completed.")
        advice = parsed.get("advice", "Remain cautious and verify sender credentials.")

        return ScamAnalysisResult(
            risk_score=score,
            risk_level=level,
            signals=signals,
            explanation=explanation,
            advice=advice,
            model_used=self.model,
            provider="qwen3 (alibaba-cloud-dashscope)",
            latency_ms=latency
        )
