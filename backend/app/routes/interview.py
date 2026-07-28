from fastapi import APIRouter
from app.schemas.interview import InterviewRequest, EvaluationRequest
from app.services.question_service import generate_questions, get_questions_map
from app.gemini_service import evaluate_answers

router = APIRouter()


@router.post("/generate-questions")
def generate(data: InterviewRequest):
    questions = generate_questions(data)
    return {"questions": questions}


@router.post("/evaluate")
def evaluate(data: EvaluationRequest):
    # Build a questions_map from answer data so AI can use question text
    # The frontend sends question_text on each answer for per-Q feedback
    questions_map = {}
    for a in data.answers:
        if a.question_text:
            questions_map[a.question_id] = {"question": a.question_text, "explanation": ""}

    return evaluate_answers(
        interview_data=data.interview_data,
        answers=data.answers,
        questions_map=questions_map,
    )