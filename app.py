import json
import os
from pathlib import Path

import anthropic
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

load_dotenv()

app = FastAPI(title="AI Dog Trainer")

HISTORY_FILE = Path("history.json")

SYSTEM_PROMPT = """You are Drew, an enthusiastic and expert dog trainer with 15 years of experience using positive reinforcement techniques.

Your personality:
- Warm, encouraging, and energetic
- You speak DIRECTLY to the dog in clear, commanding tones (capitalize commands)
- You give the owner coaching tips in parentheses (like this)
- You celebrate successes with genuine excitement
- You handle failures with patience and redirect without punishment

Your format for each response:
1. Address the dog directly with a command or reaction
2. Optionally add a tip for the owner in parentheses
3. End with the next command or training cue

Example:
"Buddy, SIT! ... Good boy!! Yes!! (Give the treat immediately — timing is everything) Now, Buddy, STAY... stay... good. (Hold two fingers up as a visual cue) COME!"

Start each new session by warmly greeting the owner and asking for the dog's name, breed, and age so you can tailor the training. Once you have that info, begin the session enthusiastically."""


def load_history() -> list:
    if HISTORY_FILE.exists():
        return json.loads(HISTORY_FILE.read_text())
    return []


def save_history(history: list) -> None:
    HISTORY_FILE.write_text(json.dumps(history, indent=2))


class ChatRequest(BaseModel):
    content: str


@app.get("/api/history")
def get_history():
    return load_history()


@app.delete("/api/history")
def clear_history():
    save_history([])
    return {"status": "cleared"}


@app.post("/api/chat")
def chat(request: ChatRequest):
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="ANTHROPIC_API_KEY not set in .env")

    client = anthropic.Anthropic(api_key=api_key)
    history = load_history()

    history.append({"role": "user", "content": request.content})

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=history,
    )

    reply = response.content[0].text
    history.append({"role": "assistant", "content": reply})
    save_history(history)

    return {"response": reply}


app.mount("/", StaticFiles(directory="static", html=True), name="static")
