from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class InterviewRequest(BaseModel):
    role: str
    experience: str
    language: str
    difficulty: str
    company: Optional[str] = None          # NEW — company-specific mode


class AnswerSubmission(BaseModel):
    question_id: int
    question_type: str                     # "mcq" | "code" | "text"
    selected: Optional[int] = None        # index for mcq/code
    text: Optional[str] = None            # for text questions
    correct: Optional[int] = None         # correct index sent from frontend
    question_text: Optional[str] = None   # NEW — question text for per-Q feedback


class PerQuestionFeedback(BaseModel):     # NEW
    question_id: int
    question_type: str
    score: Optional[int] = None           # 0-10 (text only)
    verdict: Optional[str] = None         # "Correct" | "Wrong" | "Partial" | "Skipped"
    why_weak: Optional[str] = None        # explanation of weakness
    ideal_answer: Optional[str] = None    # what a good answer looks like
    missed_keywords: Optional[List[str]] = None


class ReadinessDimension(BaseModel):      # NEW
    technical: int
    communication: int
    problem_solving: int
    speed: int
    accuracy: int


class EvaluationRequest(BaseModel):
    interview_data: dict
    answers: List[AnswerSubmission]

class ExplainRequest(BaseModel):
    question: str
    subject: str


class InterviewSessionCreate(BaseModel):
    user_id: Optional[str] = None
    interview_data: Dict[str, Any]
    answers: List[AnswerSubmission]
    evaluation: Dict[str, Any]


class InterviewSessionResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    interview_data: Dict[str, Any]
    answers: List[AnswerSubmission]
    evaluation: Dict[str, Any]
    created_at: str
