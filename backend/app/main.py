import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.interview import router as interview_router

app = FastAPI(title="InterviewMate API")

# Allow localhost (dev) + Netlify production + any Netlify preview URLs
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://interviewmateai.netlify.app",   # your production Netlify URL
]

# Allow extra origins via environment variable (e.g. for Render preview URLs)
extra = os.getenv("ALLOWED_ORIGINS", "")
if extra:
    origins += [o.strip() for o in extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.netlify\.app",  # covers all Netlify preview deploys
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to InterviewMate Backend"
    }