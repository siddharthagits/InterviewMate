import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import close_mongodb_connection, connect_to_mongodb
from app.routes.interview import router as interview_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    connect_to_mongodb()
    yield
    close_mongodb_connection()


app = FastAPI(title="InterviewMate API", lifespan=lifespan)

# Allow localhost (dev) + Vercel / Netlify production + preview URLs
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "https://aiinterviewmate.vercel.app",    # your production Vercel URL
    "https://interviewmateai.netlify.app",   # Netlify URL
]

# Allow extra origins via environment variable (e.g. for Render preview URLs)
extra = os.getenv("ALLOWED_ORIGINS", "")
if extra:
    origins += [o.strip() for o in extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*(\.vercel\.app|\.netlify\.app)",  # covers all Vercel and Netlify preview deploys
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
