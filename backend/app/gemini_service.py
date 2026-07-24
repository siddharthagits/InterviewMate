import os, json, re
from dotenv import load_dotenv

try:
    from google import genai
except Exception:
    genai = None

load_dotenv()

client = None
if genai is not None and os.getenv("GEMINI_API_KEY"):
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    except Exception:
        client = None


# ── Fallback: text-only evaluation ────────────────────────────────────────────
def _fallback_text_eval(text_answers):
    combined = " ".join(text_answers).lower()
    word_count = len(re.findall(r"\b[\w'-]+\b", combined))
    strong = ["because","example","experience","impact","improved","team","architecture","production","result"]
    weak   = ["don't","not sure","unknown","idk","nothing"]

    score = 45 + min(30, word_count // 6)
    if any(m in combined for m in strong): score += 15
    if any(m in combined for m in weak):   score -= 15
    score = max(30, min(100, score))

    if score >= 80:
        return {"text_score": score, "feedback": "Strong answers with clear reasoning and concrete examples.",
                "strengths": ["Clear structure", "Good examples", "Ownership mindset"],
                "improvements": ["Add metrics to quantify results"]}
    elif score >= 60:
        return {"text_score": score, "feedback": "Decent answers — more specifics would strengthen them.",
                "strengths": ["Relevant experience", "Reasonable explanations"],
                "improvements": ["Use concrete examples", "Quantify achievements"]}
    return {"text_score": score, "feedback": "Answers need more depth, structure and evidence.",
            "strengths": ["Attempted all questions"],
            "improvements": ["Add specific examples", "Explain reasoning more clearly"]}


def _gemini_text_eval(interview_data, text_answers):
    prompt = f"""You are a Senior Engineer evaluating a mock interview.
Interview: {interview_data}
Candidate text answers: {text_answers}

Return ONLY valid JSON:
{{"text_score": 75, "feedback": "...", "strengths": ["..."], "improvements": ["..."]}}
"""
    for model in ("gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"):
        try:
            resp = client.models.generate_content(model=model, contents=prompt)
            text = resp.text.strip().replace("```json","").replace("```","")
            parsed = json.loads(text.strip())
            if {"text_score","feedback","strengths","improvements"}.issubset(parsed):
                return parsed
        except Exception:
            continue
    return None


def evaluate_answers(interview_data, answers):
    """
    answers: list of AnswerSubmission objects or list of text strings for fallback evaluation
    Returns full result dict with combined score.
    """
    if answers and isinstance(answers[0], str):
        text_answers = answers
        mcq_answers = []
        code_answers = []
    else:
        mcq_answers  = [a for a in answers if getattr(a, "question_type", None) == "mcq"]
        code_answers = [a for a in answers if getattr(a, "question_type", None) == "code"]
        text_answers = [a for a in answers if getattr(a, "question_type", None) == "text"]

    # Auto-score MCQ
    mcq_correct = sum(1 for a in mcq_answers  if getattr(a, "selected", None) is not None and getattr(a, "correct", None) is not None and a.selected == a.correct)
    code_correct= sum(1 for a in code_answers if getattr(a, "selected", None) is not None and getattr(a, "correct", None) is not None and a.selected == a.correct)

    total_mcq  = len(mcq_answers)  or 1
    total_code = len(code_answers) or 1

    mcq_pct  = mcq_correct  / total_mcq  * 100
    code_pct = code_correct / total_code * 100

    # Evaluate text with Gemini / fallback
    if answers and isinstance(answers[0], str):
        text_strings = text_answers
    else:
        text_strings = [getattr(a, "text", "") or "" for a in text_answers]
    combined_text = "".join(text_strings).strip()

    if not combined_text:
        text_eval = {
            "text_score": 0,
            "feedback": "No text answers provided. You skipped all descriptive questions.",
            "strengths": [],
            "improvements": ["Answer text questions to demonstrate communication and problem solving."]
        }
    elif client:
        text_eval = _gemini_text_eval(interview_data, text_strings) or _fallback_text_eval(text_strings)
    else:
        text_eval = _fallback_text_eval(text_strings)

    text_score = text_eval.get("text_score", 50)

    # Combined: MCQ 50% | Code 20% | Text 30%
    final = round(mcq_pct * 0.50 + code_pct * 0.20 + text_score * 0.30)
    final = max(0, min(100, final))

    return {
        "score": final,
        "mcq_score": round(mcq_pct),
        "code_score": round(code_pct),
        "text_score": round(text_score),
        "mcq_correct": mcq_correct,
        "mcq_total": total_mcq,
        "code_correct": code_correct,
        "code_total": total_code,
        "feedback": text_eval.get("feedback", ""),
        "strengths": text_eval.get("strengths", []),
        "improvements": text_eval.get("improvements", []),
    }