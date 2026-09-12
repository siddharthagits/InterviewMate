import os
import sys
from contextlib import asynccontextmanager

# Force UTF-8 encoding on Windows console so emojis/Unicode don't crash the server
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv(override=True)

from app.database import close_mongodb_connection, connect_to_mongodb, ping_mongodb
from app.routes.interview import router as interview_router
from app.routes.auth import router as auth_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    # 1. Create motor client (sync — just sets up the object)
    connect_to_mongodb()

    # 2. Async ping to Atlas to verify connectivity + ensure indexes
    connected = await ping_mongodb()
    if connected:
        print("[App] READY - MongoDB Atlas is live.")
    else:
        print("[App] WARNING - Starting without MongoDB. Falling back to in-memory auth store.")

    yield

    # Teardown
    close_mongodb_connection()


app = FastAPI(title="InterviewMate API", version="1.0.0", lifespan=lifespan)

# ── CORS ──────────────────────────────────────────────────────────────────────
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
    "http://localhost:3000",
    "https://aiinterviewmate.onrender.com",
    "https://interviewmate-frontend.onrender.com",
    "https://aiinterviewmate.vercel.app",
    "https://interviewmateai.netlify.app",
]

# Extra origins from env (e.g. ALLOWED_ORIGINS=https://mycustomdomain.com)
extra = os.getenv("ALLOWED_ORIGINS", "")
if extra:
    origins += [o.strip() for o in extra.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*(\.onrender\.com|\.vercel\.app|\.netlify\.app)",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(interview_router)
app.include_router(auth_router)


@app.get("/")
def home():
    return {"message": "InterviewMate API is running", "status": "ok"}


@app.get("/health")
async def health():
    """Health check endpoint — also reports MongoDB connectivity."""
    from app.database import _client
    mongo_ok = False
    if _client:
        try:
            await _client.admin.command("ping")
            mongo_ok = True
        except Exception:
            pass
    return {
        "status": "ok",
        "mongodb": "connected" if mongo_ok else "unavailable",
    }
