from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


class RiskLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"


class AnalyzeRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=10000, description="The message content to analyze for scam indicators")
    preferred_model: Optional[str] = Field(None, description="Optional override for model selection (e.g. qwen3, qwen2.5:7b, heuristic)")


class ScamAnalysisResult(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="Risk score between 0 and 100")
    risk_level: RiskLevel = Field(..., description="Risk assessment: LOW, MEDIUM, or HIGH")
    signals: List[str] = Field(default_factory=list, description="Detected scam indicators and threat signals")
    explanation: str = Field(..., description="Short explanation of findings, framed cautiously without claiming absolute certainty")
    advice: str = Field(..., description="Protective recommendations and safety guidelines for the user")
    model_used: Optional[str] = Field(default="qwen3", description="The AI model that produced the assessment")
    provider: Optional[str] = Field(default="qwen3 (open-weight)", description="The provider used (e.g. qwen_ollama, qwen_dashscope, heuristic)")
    latency_ms: Optional[float] = Field(default=None, description="Latency in milliseconds")


class HealthResponse(BaseModel):
    status: str
    service: str
    active_provider: str
    model: str
    ollama_available: bool
