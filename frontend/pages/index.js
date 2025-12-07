// frontend/pages/index.js

import { useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [predictionId, setPredictionId] = useState("BTC_24h_001");

  const go = (e) => {
    e.preventDefault();
    if (!predictionId) return;
    router.push(`/prediction/${encodeURIComponent(predictionId)}`);
  };

  return (
    <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Phi.ai Prediction Registry (Neo N3 TestNet)</h1>
      <form onSubmit={go} style={{ marginTop: 16 }}>
        <label>
          Prediction ID:&nbsp;
          <input
            value={predictionId}
            onChange={(e) => setPredictionId(e.target.value)}
            style={{ padding: 4, minWidth: 280 }}
          />
        </label>
        <button
          type="submit"
          style={{ marginLeft: 8, padding: "4px 10px", cursor: "pointer" }}
        >
          View on-chain
        </button>
      </form>
    </div>
  );
}
