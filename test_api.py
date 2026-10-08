import asyncio
import httpx
import json

BASE_URL = "http://127.0.0.1:8000"

TEST_MESSAGES = [
    {
        "type": "Safe",
        "message": "Hi Mark, your dental cleaning appointment is scheduled for tomorrow at 2:00 PM at Smile Care Dental. Call 555-0143 if you need to reschedule."
    },
    {
        "type": "Suspicious",
        "message": "Netflix alert: We could not process your latest payment. Update your credit card details immediately via bit.ly/nflx-billing-update to avoid streaming cancellation."
    },
    {
        "type": "High Risk",
        "message": "URGENT NOTICE: Federal Marshal Service. An active arrest warrant has been submitted in your name for tax evasion. Pay $3,500 immediately in Bitcoin or local police will be dispatched."
    }
]


async def run_tests():
    async with httpx.AsyncClient(base_url=BASE_URL, timeout=90.0) as client:
        print("1. Checking health endpoint...")
        try:
            health = await client.get("/api/health")
            print(f"Health status: {health.status_code}")
            print(json.dumps(health.json(), indent=2))
        except Exception as e:
            print(f"Health check failed (is server running?): {e}")
            return

        print("\n2. Checking examples endpoint...")
        examples = await client.get("/api/examples")
        print(f"Examples status: {examples.status_code}")
        print(f"Loaded {len(examples.json())} sample messages.")

        print("\n3. Testing Scam Analysis...")
        for item in TEST_MESSAGES:
            print(f"\n--- Testing [{item['type']}] Message ---")
            payload = {"message": item["message"]}
            res = await client.post("/api/analyze", json=payload)
            if res.status_code == 200:
                data = res.json()
                print(f"Risk Score : {data['risk_score']} / 100")
                print(f"Risk Level : {data['risk_level']}")
                print(f"Signals    : {data['signals']}")
                print(f"Explanation: {data['explanation']}")
                print(f"Advice     : {data['advice']}")
                print(f"Model Used : {data.get('model_used')} ({data.get('provider')}) [{data.get('latency_ms')}ms]")
            else:
                print(f"Error {res.status_code}: {res.text}")


if __name__ == "__main__":
    asyncio.run(run_tests())
