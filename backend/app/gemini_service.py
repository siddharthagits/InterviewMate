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


# ── Helpers ────────────────────────────────────────────────────────────────────
def _call_gemini(prompt: str) -> str | None:
    """Try all available Gemini models and return raw text or None."""
    if not client:
        return None
    for model in ("gemini-2.0-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite"):
        try:
            resp = client.models.generate_content(model=model, contents=prompt)
            text = resp.text.strip().replace("```json", "").replace("```", "").strip()
            return text
        except Exception:
            continue
    return None


def _parse_json(text: str) -> dict | list | None:
    try:
        return json.loads(text)
    except Exception:
        # try extracting JSON object/array
        for start_char, end_char in [('{', '}'), ('[', ']')]:
            s = text.find(start_char)
            e = text.rfind(end_char)
            if s != -1 and e != -1:
                try:
                    return json.loads(text[s:e+1])
                except Exception:
                    pass
    return None


# ── Fallback text evaluation ───────────────────────────────────────────────────
def _fallback_text_eval(text_answers):
    combined = " ".join(text_answers).lower()
    word_count = len(re.findall(r"\b[\w'-]+\b", combined))
    strong = ["because", "example", "experience", "impact", "improved", "team",
              "architecture", "production", "result", "solution", "implemented"]
    weak   = ["don't know", "not sure", "unknown", "idk", "nothing", "no idea"]

    score = 45 + min(30, word_count // 6)
    if any(m in combined for m in strong): score += 15
    if any(m in combined for m in weak):   score -= 15
    score = max(30, min(100, score))

    if score >= 80:
        return {"text_score": score,
                "feedback": "Strong answers with clear reasoning and concrete examples.",
                "strengths": ["Clear structure", "Good examples", "Ownership mindset"],
                "improvements": ["Add metrics to quantify results"]}
    elif score >= 60:
        return {"text_score": score,
                "feedback": "Decent answers — more specifics would strengthen them.",
                "strengths": ["Relevant experience", "Reasonable explanations"],
                "improvements": ["Use concrete examples", "Quantify achievements"]}
    return {"text_score": score,
            "feedback": "Answers need more depth, structure and evidence.",
            "strengths": ["Attempted all questions"],
            "improvements": ["Add specific examples", "Explain reasoning more clearly"]}


# ── Overall text evaluation ────────────────────────────────────────────────────
def _gemini_text_eval(interview_data, text_answers):
    prompt = f"""You are a Senior Engineer evaluating a mock interview.
Interview context: {interview_data}
Candidate text answers: {text_answers}

Return ONLY valid JSON (no markdown):
{{"text_score": 75, "feedback": "...", "strengths": ["..."], "improvements": ["..."]}}
"""
    raw = _call_gemini(prompt)
    if not raw:
        return None
    parsed = _parse_json(raw)
    if parsed and {"text_score", "feedback", "strengths", "improvements"}.issubset(parsed):
        return parsed
    return None


# ── Per-question deep AI feedback ─────────────────────────────────────────────
def _fallback_per_question(answers, questions_map):
    """Generate simple per-question feedback without AI."""
    result = []
    for a in answers:
        qtype = getattr(a, "question_type", "mcq")
        qid   = getattr(a, "question_id", 0)

        if qtype == "text":
            text = (getattr(a, "text", "") or "").strip()
            wc   = len(text.split()) if text else 0
            score = min(10, max(1, wc // 8)) if text else 0
            result.append({
                "question_id": qid,
                "question_type": "text",
                "score": score,
                "verdict": "Answered" if text else "Skipped",
                "why_weak": "Answer was too brief." if wc < 20 else "Good attempt.",
                "ideal_answer": questions_map.get(qid, {}).get("explanation", "No ideal answer available."),
                "missed_keywords": [],
            })
        else:
            selected = getattr(a, "selected", None)
            correct  = getattr(a, "correct", None)
            is_correct = (selected is not None and correct is not None and selected == correct)
            result.append({
                "question_id": qid,
                "question_type": qtype,
                "score": None,
                "verdict": "Correct" if is_correct else ("Wrong" if selected is not None else "Skipped"),
                "why_weak": None if is_correct else "Incorrect option selected.",
                "ideal_answer": questions_map.get(qid, {}).get("explanation", ""),
                "missed_keywords": [],
            })
    return result


def evaluate_per_question(answers, interview_data: dict, questions_map: dict):
    """
    Generate per-question deep feedback.
    answers: list of AnswerSubmission objects
    questions_map: dict of question_id -> question dict (for explanation/ideal)
    """
    text_answers = [a for a in answers if getattr(a, "question_type", "") == "text"]
    mcq_code     = [a for a in answers if getattr(a, "question_type", "") in ("mcq", "code")]

    per_q = []

    # ── MCQ / Code — deterministic
    for a in mcq_code:
        selected = getattr(a, "selected", None)
        correct  = getattr(a, "correct", None)
        is_correct = (selected is not None and correct is not None and selected == correct)
        qid = getattr(a, "question_id", 0)
        per_q.append({
            "question_id": qid,
            "question_type": getattr(a, "question_type", "mcq"),
            "score": None,
            "verdict": "Correct" if is_correct else ("Wrong" if selected is not None else "Skipped"),
            "why_weak": None if is_correct else "You selected an incorrect option.",
            "ideal_answer": questions_map.get(qid, {}).get("explanation", ""),
            "missed_keywords": [],
        })

    # ── Text — AI per question
    if client and text_answers:
        for a in text_answers:
            qid  = getattr(a, "question_id", 0)
            text = (getattr(a, "text", "") or "").strip()
            q_text = getattr(a, "question_text", None) or questions_map.get(qid, {}).get("question", "")
            ideal_hint = questions_map.get(qid, {}).get("explanation", "")

            if not text:
                per_q.append({
                    "question_id": qid, "question_type": "text",
                    "score": 0, "verdict": "Skipped",
                    "why_weak": "No answer was provided.",
                    "ideal_answer": ideal_hint, "missed_keywords": [],
                })
                continue

            prompt = f"""You are an expert technical interviewer. Evaluate this candidate answer.

Role: {interview_data.get('role','')}, Difficulty: {interview_data.get('difficulty','')}, Language: {interview_data.get('language','')}
Question: {q_text}
Candidate Answer: {text}
Ideal Answer Hint: {ideal_hint}

Return ONLY valid JSON (no markdown):
{{
  "score": 7,
  "verdict": "Partial",
  "why_weak": "Missing explanation of time complexity...",
  "ideal_answer": "A strong answer would cover...",
  "missed_keywords": ["Big O", "recursion", "memoization"]
}}

score: 0-10 (10 = perfect), verdict: "Excellent"|"Good"|"Partial"|"Weak"|"Skipped"
missed_keywords: up to 4 important terms/concepts the answer missed.
"""
            raw = _call_gemini(prompt)
            parsed = _parse_json(raw) if raw else None
            if parsed and "score" in parsed:
                per_q.append({
                    "question_id": qid,
                    "question_type": "text",
                    "score": int(parsed.get("score", 5)),
                    "verdict": parsed.get("verdict", "Answered"),
                    "why_weak": parsed.get("why_weak", ""),
                    "ideal_answer": parsed.get("ideal_answer", ideal_hint),
                    "missed_keywords": parsed.get("missed_keywords", []),
                })
            else:
                per_q.append({
                    "question_id": qid, "question_type": "text",
                    "score": 5, "verdict": "Answered",
                    "why_weak": "Could not evaluate this answer automatically.",
                    "ideal_answer": ideal_hint, "missed_keywords": [],
                })
    else:
        # fallback for text
        for a in text_answers:
            qid  = getattr(a, "question_id", 0)
            text = (getattr(a, "text", "") or "").strip()
            wc   = len(text.split()) if text else 0
            score = min(10, max(1, wc // 8)) if text else 0
            per_q.append({
                "question_id": qid, "question_type": "text",
                "score": score, "verdict": "Answered" if text else "Skipped",
                "why_weak": "Answer was too brief." if wc < 20 else "Decent attempt.",
                "ideal_answer": questions_map.get(qid, {}).get("explanation", ""),
                "missed_keywords": [],
            })

    return per_q


# ── Hiring Readiness Score ────────────────────────────────────────────────────
def _fallback_readiness(score, interview_data):
    """Compute readiness without AI based on numeric score."""
    base = score
    return {
        "readiness": base,
        "dimensions": {
            "technical":       min(100, base + 5),
            "communication":   min(100, max(20, base - 10)),
            "problem_solving": min(100, base),
            "speed":           min(100, max(20, base - 5)),
            "accuracy":        min(100, base + 3),
        },
        "roadmap": [
            {"area": "Technical Depth", "action": "Practice 2 LeetCode problems daily (Easy→Medium)."},
            {"area": "Communication",   "action": "Use STAR format: Situation, Task, Action, Result."},
            {"area": "Problem Solving", "action": "Study system design fundamentals on roadmap.sh."},
        ],
        "summary": f"You scored {base}/100. Keep practicing to improve consistency.",
    }


def calculate_readiness(score: int, interview_data: dict, strengths: list, improvements: list):
    """Calculate hiring readiness across 5 dimensions."""
    role = interview_data.get("role", "Software Engineer")
    exp  = interview_data.get("experience", "Fresher")

    if not client:
        return _fallback_readiness(score, interview_data)

    prompt = f"""You are a career coach evaluating interview readiness.

Candidate profile: Role={role}, Experience={exp}
Overall interview score: {score}/100
Strengths identified: {strengths}
Areas to improve: {improvements}

Return ONLY valid JSON (no markdown):
{{
  "readiness": 72,
  "dimensions": {{
    "technical": 75,
    "communication": 60,
    "problem_solving": 70,
    "speed": 65,
    "accuracy": 80
  }},
  "roadmap": [
    {{"area": "Communication", "action": "Practice STAR method for behavioral questions daily."}},
    {{"area": "Technical", "action": "Revise core {interview_data.get('language','')} concepts weekly."}},
    {{"area": "Problem Solving", "action": "Solve 3 problems per week on LeetCode."}}
  ],
  "summary": "Strong technical foundation but communication needs work..."
}}

All dimension values: 0-100. readiness: overall 0-100.
roadmap: 3 actionable steps with specific area and concrete action.
"""
    raw = _call_gemini(prompt)
    parsed = _parse_json(raw) if raw else None
    if parsed and "readiness" in parsed and "dimensions" in parsed:
        return parsed
    return _fallback_readiness(score, interview_data)


# ── Main evaluate_answers (existing + enhanced) ────────────────────────────────
def evaluate_answers(interview_data, answers, questions_map: dict = None):
    """
    answers: list of AnswerSubmission objects or strings
    questions_map: optional dict of question_id -> question dict
    Returns full result dict including per_question_feedback and readiness.
    """
    if questions_map is None:
        questions_map = {}

    if answers and isinstance(answers[0], str):
        text_answers = answers
        mcq_answers, code_answers = [], []
    else:
        mcq_answers  = [a for a in answers if getattr(a, "question_type", None) == "mcq"]
        code_answers = [a for a in answers if getattr(a, "question_type", None) == "code"]
        text_answers_obj = [a for a in answers if getattr(a, "question_type", None) == "text"]
        text_answers = [getattr(a, "text", "") or "" for a in text_answers_obj]

    # ── Auto-score MCQ / Code
    mcq_correct  = sum(1 for a in mcq_answers  if getattr(a, "selected", None) is not None
                       and getattr(a, "correct", None) is not None and a.selected == a.correct)
    code_correct = sum(1 for a in code_answers if getattr(a, "selected", None) is not None
                       and getattr(a, "correct", None) is not None and a.selected == a.correct)

    total_mcq  = len(mcq_answers)  or 1
    total_code = len(code_answers) or 1
    mcq_pct    = mcq_correct  / total_mcq  * 100
    code_pct   = code_correct / total_code * 100

    # ── Text evaluation
    combined_text = "".join(text_answers).strip()
    if not combined_text:
        text_eval = {
            "text_score": 0,
            "feedback": "No text answers provided. You skipped all descriptive questions.",
            "strengths": [],
            "improvements": ["Answer text questions to demonstrate communication and problem solving."]
        }
    elif client:
        text_eval = _gemini_text_eval(interview_data, text_answers) or _fallback_text_eval(text_answers)
    else:
        text_eval = _fallback_text_eval(text_answers)

    text_score = text_eval.get("text_score", 50)
    final = round(mcq_pct * 0.50 + code_pct * 0.20 + text_score * 0.30)
    final = max(0, min(100, final))

    strengths    = text_eval.get("strengths", [])
    improvements = text_eval.get("improvements", [])

    # ── Per-question deep feedback
    if answers and not isinstance(answers[0], str):
        per_q = evaluate_per_question(answers, interview_data, questions_map)
    else:
        per_q = []

    # ── Hiring readiness
    readiness = calculate_readiness(final, interview_data, strengths, improvements)

    return {
        "score":        final,
        "mcq_score":    round(mcq_pct),
        "code_score":   round(code_pct),
        "text_score":   round(text_score),
        "mcq_correct":  mcq_correct,
        "mcq_total":    total_mcq,
        "code_correct": code_correct,
        "code_total":   total_code,
        "feedback":     text_eval.get("feedback", ""),
        "strengths":    strengths,
        "improvements": improvements,
        "per_question_feedback": per_q,       # NEW
        "readiness":    readiness,             # NEW
    }