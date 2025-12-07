// frontend/lib/neoRpc.js
// No external libs; pure fetch-based JSON-RPC calls to NEO N3 testnet.

const RPC_URL =
  process.env.NEXT_PUBLIC_NEO_RPC_URL || "https://testnet1.neo.coz.io";

// Your deployed contract script hash (little-endian, like you used in curl):
const CONTRACT_HASH =
  process.env.NEXT_PUBLIC_PHI_CONTRACT_HASH ||
  "0xbf543d7e8371e06756a67b149004738420d1bd2b";

/**
 * Call getPrediction(predictionId: string) on the PhiPredictionRegistry contract.
 * Returns the raw stack item from the RPC response.
 */
export async function getPrediction(predictionId) {
  if (!predictionId || predictionId.length === 0) {
    throw new Error("predictionId is required");
  }

  const payload = {
    jsonrpc: "2.0",
    method: "invokefunction",
    params: [
      CONTRACT_HASH,
      "getPrediction",
      [
        {
          type: "String",
          value: predictionId,
        },
      ],
    ],
    id: 1,
  };

  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`RPC HTTP error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.result) {
    throw new Error(
      `RPC error: ${JSON.stringify(data.error || "no result field")}`
    );
  }

  const result = data.result;

  if (result.state !== "HALT") {
    throw new Error(
      `VM fault: ${result.state} - ${result.exception || "unknown error"}`
    );
  }

  // Our contract returns an Any -> Array:
  // [] for "not found"
  // [user, eventId, probability, confidence, riskTier, seed, neofsCid, timestamp, agentVersion, profileHash]
  const stackItem = result.stack && result.stack[0];

  return stackItem;
}

/**
 * Convert the raw stack item into a nicer JS object.
 */
export function parsePredictionStackItem(stackItem) {
  if (!stackItem || stackItem.type !== "Array") {
    return null;
  }

  const arr = stackItem.value || [];
  if (arr.length === 0) {
    // Not found
    return null;
  }

  const get = (i) => (arr[i] ? arr[i] : { type: "Any", value: null });

  return {
    user: get(0).value,          // ByteString (base64 script hash)
    eventId: get(1).value,       // String
    probability: get(2).value,   // Integer (stringified)
    confidence: get(3).value,    // Integer (stringified)
    riskTier: get(4).value,      // Integer
    seed: get(5).value,          // Integer
    neofsCid: get(6).value,      // String
    timestamp: get(7).value,     // Integer (block time)
    agentVersion: get(8).value,  // String
    profileHash: get(9).value,   // ByteString (base64)
  };
}
