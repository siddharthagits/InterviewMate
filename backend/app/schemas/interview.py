from pydantic import BaseModel
from typing import List, Optional


class InterviewRequest(BaseModel):
    role: str
    experience: str
    language: str
    difficulty: str


class AnswerSubmission(BaseModel):
    question_id: int
    question_type: str          # "mcq" | "code" | "text"
    selected: Optional[int] = None   # index for mcq/code
    text: Optional[str] = None       # for text questions
    correct: Optional[int] = None    # correct index sent from frontend for auto-scoring


class EvaluationRequest(BaseModel):
    interview_data: dict
    answers: List[AnswerSubmission]