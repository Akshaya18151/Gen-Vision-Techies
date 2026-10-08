import re
import time
from typing import List, Tuple
from app.schemas import ScamAnalysisResult, RiskLevel
from app.ai.base import BaseAIProvider


class HeuristicProvider(BaseAIProvider):
    """
    Heuristic Cybersecurity Engine for scam signal detection.
    Used for instant local threat analysis and as high-availability fallback.
    """

    PATTERNS: List[Tuple[str, str, int]] = [
        # (Regex, Signal Description, Score Weight)
        (r"\b(urgent|immediately|act now|final notice|24 hours|immediate action required|expires today)\b", "High-pressure urgency tactic", 18),
        (r"\b(arrest warrant|police|irs|fbi|law enforcement|court appearance|federal warrant)\b", "Authority impersonation & legal threat", 25),
        (r"\b(suspend(ed)?|terminate(d)?|locked out|freeze your account|account frozen)\b", "Fear-inducing account restriction warning", 20),
        (r"\b(bitcoin|cryptocurrency|crypto|gift card(s)?|apple card|steam card|western union|wire transfer)\b", "Irreversible or untraceable payment method requested", 28),
        (r"\b(verify your (identity|account|password|pin)|confirm your ssn|social security|enter credentials)\b", "Potential credential / identity harvesting attempt", 24),
        (r"\b(bit\.ly|tinyurl\.com|t\.co|goo\.gl|is\.gd|cutt\.ly|ow\.ly|shorturl\.at|v\.gd)\b", "Shortened / obfuscated hyperlink hiding destination", 22),
        (r"\bhttps?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b", "Direct IP address link instead of legitimate domain", 26),
        (r"\b(you have won|congratulations you('ve| have) won|lottery winner|cash prize|unclaimed funds|\$\d{3,}(,\d{3})*)\b", "Unsolicited prize or unexpected wealth lure", 22),
        (r"\b(otp|one-time password|verification code|security code)\b", "Request or reference to sensitive verification token", 18),
        (r"\b(package delivery failed|usps|dhl|fedex|customs fee|parcel tracking)\b", "Delivery notification lure / smishing trigger", 16),
        (r"\b(bank of america|wells fargo|chase|paypal|venmo|cash app|zelle)\b", "Financial institution name mentioned in unverified context", 15),
        (r"https?:\/\/(?!www\.(google|apple|amazon|microsoft|paypal|chase|bankofamerica)\.com)[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}\/[^\s]*", "Third-party external link present in notification", 12),
    ]

    async def is_available(self) -> bool:
        return True

    async def analyze(self, message: str) -> ScamAnalysisResult:
        start_time = time.time()
        text_lower = message.lower()

        detected_signals: List[str] = []
        raw_score = 0

        for pattern, signal_name, weight in self.PATTERNS:
            if re.search(pattern, text_lower):
                detected_signals.append(signal_name)
                raw_score += weight

        # Baseline logic
        if not detected_signals:
            # Check if routine message
            score = 12 if ("http" in text_lower or len(message) > 100) else 5
            level = RiskLevel.LOW
            signals = ["No overt phishing or scam patterns detected in message content"]
            explanation = "This message demonstrates standard communication patterns with no high-pressure coercion, urgent payment demands, or deceptive links."
            advice = "The message appears low-risk. As standard practice, avoid sharing private credentials or clicking unexpected attachments."
        else:
            # Normalize score
            score = min(98, max(25, raw_score))
            if score < 40:
                level = RiskLevel.LOW
                explanation = "This message exhibits minor anomalies, but lacks aggressive deception triggers. It is assessed as low risk."
                advice = "Verify sender authenticity before interacting with links or replying."
            elif score < 70:
                level = RiskLevel.MEDIUM
                explanation = "This potential scam message exhibits several suspicious indicators such as unverified links or moderate urgency."
                advice = "Exercise caution. Do not click links directly; navigate to official websites independently."
            else:
                level = RiskLevel.HIGH
                explanation = "This is a high-risk message displaying hallmark social engineering techniques, including artificial urgency and suspicious demands."
                advice = "Do not click links, send money, or provide personal credentials. Report and block the sender immediately."

        latency = round((time.time() - start_time) * 1000, 1)

        return ScamAnalysisResult(
            risk_score=score,
            risk_level=level,
            signals=detected_signals if detected_signals else signals,
            explanation=explanation,
            advice=advice,
            model_used="Heuristic Rule Engine v1",
            provider="heuristic-fallback",
            latency_ms=latency
        )
