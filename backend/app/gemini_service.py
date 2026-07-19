import os
import json
from dotenv import load_dotenv

# Try to import the official Google GenAI client. If it's not installed,
# keep `genai` as None and surface a clear error when used.
try:
    from google import genai
except Exception:
    genai = None

load_dotenv()

client = None
if genai is not None and os.getenv("GEMINI_API_KEY"):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def evaluate_answers(interview_data, answers):
    if client is None:
        raise RuntimeError(
            "google-genai is not available or GEMINI_API_KEY not set. "
            "Install the package with `pip install google-genai` and set the GEMINI_API_KEY env var."
        )
    prompt = f"""
You are a Senior Software Engineer conducting a mock interview.

Interview Details:
{interview_data}

Candidate Answers:
{answers}

Return ONLY valid JSON:

{{
    "score": 85,
    "feedback": "Overall performance summary.",
    "strengths": [
        "Strong React knowledge",
        "Good communication"
    ],
    "improvements": [
        "Improve DSA",
        "Explain concepts with examples"
    ]
}}
"""

    response = client.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=prompt,
    )

    text = response.text.strip()

    if text.startswith("```json"):
        text = text.replace("```json", "")

    if text.endswith("```"):
        text = text.replace("```", "")

    return json.loads(text.strip())