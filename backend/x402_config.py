from typing import Any, Awaitable, Callable
from app.agents.x402_phi_service import phi_prediction_service

X402_SERVICES: dict[str, Callable[[dict[str, Any]], Awaitable[dict[str, Any]]]] = {
    "phi_prediction": phi_prediction_service
}
