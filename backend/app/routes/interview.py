from fastapi import APIRouter
from app.schemas.interview import InterviewRequest, EvaluationRequest
from app.services.question_service import generate_questions
from app.gemini_service import evaluate_answers

router = APIRouter()


@router.post("/generate-questions")
def generate(data: InterviewRequest):
    return {"questions": generate_questions(data)}


@router.post("/evaluate")
def evaluate(data: EvaluationRequest):
    return evaluate_answers(data.interview_data, data.answers)