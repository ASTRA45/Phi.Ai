from typing import Any

# decorators and metadata
from boa3.sc.compiletime import public, NeoMetadata

# storage, runtime, stdlib, utils, types
from boa3.sc import storage, runtime
from boa3.sc.contracts import StdLib
from boa3.sc.utils import to_bytes
from boa3.sc.types import UInt160


# Storage key prefix for prediction records
PREDICTION_PREFIX = b"\x01"


def neo_metadata() -> NeoMetadata:
    """
    Neo contract metadata for Phi.ai Prediction Registry.
    This is picked up automatically by neo3-boa.
    """
    meta = NeoMetadata()
    meta.name = "PhiPredictionRegistry"
    # Optional extras:
    # meta.author = "..."
    # meta.email = "..."
    # meta.description = "..."
    return meta


def _get_storage_key(prediction_id: str) -> bytes:
    """
    Compute the storage key for a given prediction id.
    Uses Boa's to_bytes helper to convert str → bytes.
    """
    return PREDICTION_PREFIX + to_bytes(prediction_id)


@public
def register_prediction(
    prediction_id: str,
    user: UInt160,
    event_id: str,
    probability: int,
    confidence: int,
    risk_tier: int,
    seed: int,
    neofs_cid: str,
    agent_version: str,
    profile_hash: bytes,
) -> None:
    """
    Register a new AI prediction/decision on-chain.

    probability & confidence are expressed in basis points (0–10000).
    e.g. 65% => 6500
    """

    # Basic argument validation
    if len(prediction_id) == 0:
        raise Exception("prediction_id required")

    if len(event_id) == 0:
        raise Exception("event_id required")

    # Neo addresses are 20-byte UInt160
    if len(user) != 20:
        raise Exception("invalid user script hash")

    if probability < 0 or probability > 10000:
        raise Exception("probability out of range")

    if confidence < 0 or confidence > 10000:
        raise Exception("confidence out of range")

    if risk_tier < 0:
        raise Exception("risk_tier must be non-negative")

    # Authorization: the tx must be signed by `user`
    if not runtime.check_witness(user):
        raise Exception("no authorization from user")

    key = _get_storage_key(prediction_id)

    # Ensure immutability: once written, never overwritten
    existing = storage.get(key)
    if len(existing) > 0:
        raise Exception("prediction already exists")

    # Build record as a simple dict of primitive types
    record = {
        "user": user,
        "event_id": event_id,
        "probability": probability,
        "confidence": confidence,
        "risk_tier": risk_tier,
        "seed": seed,
        "neofs_cid": neofs_cid,
        "timestamp": runtime.time,  # block timestamp (seconds)
        "agent_version": agent_version,
        "profile_hash": profile_hash,
    }

    # Serialize dict → bytes before storing on-chain
    serialized = StdLib.serialize(record)
    storage.put(key, serialized)


@public
def get_prediction(prediction_id: str) -> Any:
    """
    Retrieve a prediction record by id.

    Always returns a deserialized value (Any).
    For "not found" cases, returns an empty dict {}.
    """

    # If the id is empty, just return an empty object
    if len(prediction_id) == 0:
        return {}

    key = _get_storage_key(prediction_id)
    data = storage.get(key)

    # Return "empty" result if not stored
    if len(data) == 0:
        return {}

    # Deserialize back into a dict-like structure (Any)
    return StdLib.deserialize(data)
