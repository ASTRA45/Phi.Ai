# backend/app/main.py

from dotenv import load_dotenv
load_dotenv(override=True)

import json
import sys
import subprocess
import uuid
from pathlib import Path
from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.models import (
    Persona,
    Prediction,
    PredictionRequest,
    PersonaUpdateRequest,
)
from app.agents.prediction_agent import run_prediction_with_spoon

# ------------------------
# Data files (simple JSON)
# ------------------------

DATA_DIR = Path(__file__).parent.parent / "data"
PERSONAS_FILE = DATA_DIR / "personas.json"
PREDICTIONS_FILE = DATA_DIR / "predictions.json"

DATA_DIR.mkdir(exist_ok=True)


def load_json(path: Path, default):
    if not path.exists():
        return default
    with path.open("r") as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return default


def save_json(path: Path, data):
    with path.open("w") as f:
        json.dump(data, f, indent=2, default=str)


# -------------
# FastAPI app
# -------------

app = FastAPI(title="Phi.ai Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {"status": "ok"}


# -------------
# Persona APIs
# -------------

@app.post("/persona/update", response_model=Persona)
async def update_persona(body: PersonaUpdateRequest):
    personas_raw = load_json(PERSONAS_FILE, {})
    user_id = body.userId
    now = datetime.utcnow().isoformat()

    persona_dict = {
        "userId": user_id,
        "riskTolerance": body.riskTolerance,
        "markets": body.markets,
        "horizon": body.horizon,
        "domainTags": body.domainTags,
        "updatedAt": now,
    }

    if user_id not in personas_raw:
        persona_dict["createdAt"] = now
    else:
        persona_dict["createdAt"] = personas_raw[user_id].get("createdAt", now)

    personas_raw[user_id] = persona_dict
    save_json(PERSONAS_FILE, personas_raw)

    return Persona(**persona_dict)


@app.get("/persona/{user_id}", response_model=Persona)
async def get_persona(user_id: str):
    personas_raw = load_json(PERSONAS_FILE, {})
    if user_id not in personas_raw:
        raise HTTPException(status_code=404, detail="Persona not found")
    return Persona(**personas_raw[user_id])


# -------------------------------
# Neo / NeoFS publish stub
# -------------------------------

def publish_prediction_to_chain_and_neofs(prediction: Prediction) -> Prediction:
    """
    TODO: replace with real Neo smart contract + NeoFS client.

    For hackathon demo, we just attach stub hashes.
    """
    if prediction.txHash is None:
        prediction.txHash = "0xDEMO_TX_HASH"
    if prediction.neofsObjectId is None:
        prediction.neofsObjectId = "neofs-demo-object-id"
    return prediction


# ------------------------
# Prediction APIs
# ------------------------

@app.post("/predict", response_model=Prediction)
async def create_prediction(body: PredictionRequest):
    personas_raw = load_json(PERSONAS_FILE, {})
    if body.userId not in personas_raw:
        raise HTTPException(status_code=400, detail="Persona not set for user")

    persona = Persona(**personas_raw[body.userId])

    agent_result = await run_prediction_with_spoon(
        persona=persona,
        event_id=body.eventId,
        seed=body.seed,
    )

    now = datetime.utcnow().isoformat()

    prediction = Prediction(
        id=str(uuid.uuid4()),
        userId=body.userId,
        eventId=body.eventId,
        probabilityUp=agent_result["probabilityUp"],
        confidence=agent_result["confidence"],
        riskTier=agent_result["riskTier"],
        seed=agent_result["seed"],
        explanationBullets=agent_result["explanationBullets"],
        agentVersion="v0.1-spoon",
        txHash=None,
        neofsObjectId=None,
        createdAt=now,
    )

    preds_raw = load_json(PREDICTIONS_FILE, [])
    preds_raw.append(prediction.dict())
    save_json(PREDICTIONS_FILE, preds_raw)

    prediction = publish_prediction_to_chain_and_neofs(prediction)

    return prediction


@app.get("/predictions/{user_id}", response_model=List[Prediction])
async def get_predictions_for_user(user_id: str):
    preds_raw = load_json(PREDICTIONS_FILE, [])
    results = [Prediction(**p) for p in preds_raw if p["userId"] == user_id]
    return results


@app.get("/predictions/by-event/{event_id}", response_model=List[Prediction])
async def get_predictions_by_event(event_id: str):
    preds_raw = load_json(PREDICTIONS_FILE, [])
    results = [Prediction(**p) for p in preds_raw if p["eventId"] == event_id]
    return results


# ------------------------
# x402 demo endpoint
# ------------------------

class X402DemoRequest(BaseModel):
    resource: str
    amountUsdc: float | None = None


class X402DemoResponse(BaseModel):
    resource: str
    amountUsdc: float
    paymentHeader: str
    rawOutput: str


@app.post("/x402/demo-payment", response_model=X402DemoResponse)
async def x402_demo_payment(body: X402DemoRequest = Body(...)):
    """
    Simple demo endpoint:

    - uses Spoon's x402 CLI to sign a payment
    - returns the X-PAYMENT header we can show in the UI

    It relies on:
      PRIVATE_KEY or X402_AGENT_PRIVATE_KEY
      X402_FACILITATOR_URL
      X402_DEFAULT_* env vars
    """
    amount = body.amountUsdc or 0.10

    backend_root = Path(__file__).parent.parent

    cmd = [
        sys.executable,
        "-m",
        "spoon_ai.payments.cli",
        "sign",
        "--amount-usdc",
        str(amount),
        "--resource",
        body.resource,
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            cwd=str(backend_root),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"x402 CLI failed to start: {e}",
        )

    if result.returncode != 0:
        err = (result.stderr or result.stdout or "").strip()
        raise HTTPException(
            status_code=500,
            detail=f"x402 CLI error: {err}",
        )

    stdout = result.stdout.strip()
    lines = [l for l in stdout.splitlines() if l.strip()]
    payment_header = lines[-1] if lines else stdout

    return X402DemoResponse(
        resource=body.resource,
        amountUsdc=amount,
        paymentHeader=payment_header,
        rawOutput=stdout,
    )
