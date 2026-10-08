import os
from typing import List
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "ScamShield API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # Server Settings
    HOST: str = "127.0.0.1"
    PORT: int = 8000
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "http://localhost:5173",
        "*"
    ]

    # AI Provider Settings ("qwen_ollama", "qwen_dashscope", "heuristic")
    AI_PROVIDER: str = os.getenv("AI_PROVIDER", "qwen_ollama")
    
    # Qwen Model Settings (Open-Weight Model: e.g. "qwen3", "qwen3:latest")
    QWEN_MODEL: str = os.getenv("QWEN_MODEL", "qwen3")
    
    # Ollama Settings (Local Open-Weight Qwen Host)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_TIMEOUT_SECONDS: float = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "60.0"))

    # Alibaba Cloud DashScope / Model Studio Settings (Optional Hosted Qwen3 API)
    # Kept in environment variables - no hardcoded API keys
    DASHSCOPE_API_KEY: str = os.getenv("DASHSCOPE_API_KEY", "")
    DASHSCOPE_BASE_URL: str = os.getenv("DASHSCOPE_BASE_URL", "https://dashscope-intl.aliyuncs.com/compatible-mode/v1")

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
