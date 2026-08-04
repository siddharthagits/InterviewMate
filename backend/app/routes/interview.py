from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException, Query

from app.database import get_database
from app.schemas.interview import (
    EvaluationRequest,
    ExplainRequest,
    InterviewRequest,
    InterviewSessionCreate,
    InterviewSessionResponse,
)
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

@router.post("/explain-question")
def explain(data: ExplainRequest):
    from app.gemini_service import explain_question
    explanation = explain_question(data.question, data.subject)
    return {"explanation": explanation}


def serialize_session(session: dict) -> dict:
    return {
        "id": str(session["_id"]),
        "user_id": session.get("user_id"),
        "interview_data": session["interview_data"],
        "answers": session["answers"],
        "evaluation": session["evaluation"],
        "created_at": session["created_at"].isoformat(),
    }


@router.post("/interview-sessions", response_model=InterviewSessionResponse, status_code=201)
async def save_interview_session(data: InterviewSessionCreate):
    session = data.model_dump()
    session["created_at"] = datetime.now(timezone.utc)

    try:
        result = await get_database().interview_sessions.insert_one(session)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

    session["_id"] = result.inserted_id
    return serialize_session(session)


@router.get("/interview-sessions", response_model=list[InterviewSessionResponse])
async def list_interview_sessions(
    user_id: str | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
):
    query = {"user_id": user_id} if user_id else {}

    try:
        cursor = get_database().interview_sessions.find(query).sort("created_at", -1).limit(limit)
        sessions = await cursor.to_list(length=limit)
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

    return [serialize_session(session) for session in sessions]


@router.get("/interview-sessions/{session_id}", response_model=InterviewSessionResponse)
async def get_interview_session(session_id: str):
    if not ObjectId.is_valid(session_id):
        raise HTTPException(status_code=400, detail="Invalid interview session ID")

    try:
        session = await get_database().interview_sessions.find_one({"_id": ObjectId(session_id)})
    except RuntimeError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error

    if session is None:
        raise HTTPException(status_code=404, detail="Interview session not found")

    return serialize_session(session)
