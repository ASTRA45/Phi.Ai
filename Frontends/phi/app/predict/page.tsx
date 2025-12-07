"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function PredictPage() {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const EVENTS = [
    { id: "eth-up", label: "ETH goes up 24h" },
    { id: "btc-up", label: "BTC goes up 24h" },
    { id: "btc-down", label: "BTC goes down 24h" },
    { id: "apple-earnings", label: "AAPL beats earnings" },
    { id: "gold-up", label: "Gold moves up" },
  ];

  const runPrediction = async () => {
    if (!selectedEvent) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demoUser", // replace later with wallet
          eventId: selectedEvent,
          seed: 42,
        }),
      });

      const data = await res.json();
      setResult(data);

    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0015] text-white px-6 py-16 flex flex-col items-center">
      
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-bold mb-10"
      >
        Make a Prediction
      </motion.h1>

      {/* Event Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl mb-12">
        {EVENTS.map((event) => (
          <motion.button
            key={event.id}
            onClick={() => setSelectedEvent(event.id)}
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-2xl border transition text-left
              ${
                selectedEvent === event.id
                  ? "border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/30"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
          >
            <div className="text-xl font-semibold">{event.label}</div>
          </motion.button>
        ))}
      </div>

      {/* Run Button */}
      <button
        onClick={runPrediction}
        disabled={!selectedEvent || loading}
        className={`px-10 py-4 rounded-full text-lg mb-10 transition
          ${
            !selectedEvent || loading
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"
          }`}
      >
        {loading ? "Running Prediction..." : "Run Prediction"}
      </button>

      {/* Result */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl p-8 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-2xl font-bold mb-6">Prediction Results</h2>

          <div className="space-y-3">
            <div>
              <span className="text-white/50">Probability Up:</span>{" "}
              <span className="font-semibold">{Math.round(result.probabilityUp * 100)}%</span>
            </div>

            <div>
              <span className="text-white/50">Confidence:</span>{" "}
              <span className="font-semibold">{Math.round(result.confidence * 100)}%</span>
            </div>

            <div>
              <span className="text-white/50">Risk Tier:</span>{" "}
              <span className="font-semibold capitalize">{result.riskTier}</span>
            </div>

            <div>
              <span className="text-white/50">Seed:</span>{" "}
              <span className="font-semibold">{result.seed}</span>
            </div>
          </div>

          {/* Explanation */}
          <div className="mt-8">
            <h3 className="text-white/70 mb-2">Reasoning</h3>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              {result.explanationBullets.map((bullet: string, i: number) => (
                <li key={i}>{bullet}</li>
              ))}
            </ul>
          </div>

          {/* TX + NeoFS */}
          <div className="mt-8 text-sm text-white/40">
            <div>TX Hash: {result.txHash}</div>
            <div>NeoFS Object ID: {result.neofsObjectId}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
