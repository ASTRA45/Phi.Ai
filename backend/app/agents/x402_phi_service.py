from typing import Any, Dict

from app.models import Persona
from app.agents.prediction_agent import run_prediction_with_spoon
from app.main import load_json, PERSONAS_FILE


async def phi_prediction_service(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Expected payload:
    {
      "userId": "demo-user-1",
      "eventId": "BTC_24h",
      "seed": 0.437   # optional
    }
    """
    user_id = payload.get("userId")
    event_id = payload.get("eventId")
    seed = payload.get("seed")

    if not user_id or not event_id:
        raise ValueError("userId and eventId are required")

    personas_raw = load_json(PERSONAS_FILE, {})
    if user_id not in personas_raw:
        raise ValueError(f"Persona not set for user {user_id}")

    persona = Persona(**personas_raw[user_id])

    agent_result = await run_prediction_with_spoon(
        persona=persona,
        event_id=event_id,
        seed=seed,
    )

    return {
        "userId": user_id,
        "eventId": event_id,
        **agent_result,
    }
