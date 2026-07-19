from fastapi import FastAPI

app = FastAPI(title="InterviewMate API")


@app.get("/")
def home():
    return {
        "message": "Welcome to InterviewMate Backend"
    }