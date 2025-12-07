# app/x402.py

from typing import Dict, Any, Optional

# This matches the JSON you saw from /x402/requirements (x402 semantics)
X402_REQUIREMENTS: Dict[str, Any] = {
    "scheme": "exact",
    "network": "base-sepolia",
    "maxAmountRequired": "100000",  # 0.10 USDC with 6 decimals
    "resource": "https://localhost/spoon/agent",
    "description": "SpoonOS agent service",
    "mimeType": "application/json",
    "payTo": "0x0000000000000000000000000000000000000000",
    "maxTimeoutSeconds": 120,
    "asset": "0xa063b8d5ada3be64a24df594f96ab75f0fb78160",
    "extra": {
        "name": "USDC",
        "version": "2",
        "decimals": 6,
        "currency": "USDC",
        "memo": "SpoonOS agent service",
    },
}


def get_x402_requirements() -> Dict[str, Any]:
    """Return static x402 requirements."""
    return X402_REQUIREMENTS


def verify_x402_payment_header(x_payment: Optional[str]) -> bool:
    """
    VERY SIMPLE demo verification.

    In a real setup:
    - You'd use spoon_ai.payments.x402_service or a facilitator call
      to validate the X-PAYMENT header.

    For hackathon demo, we just require that *some* X-PAYMENT header is present.
    """
    return x_payment is not None and len(x_payment.strip()) > 0
