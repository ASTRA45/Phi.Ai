"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function PersonaReview() {
  const params = useSearchParams();
  const router = useRouter();

  const risk = params.get("risk");
  const markets = JSON.parse(params.get("markets") || "[]");
  const horizon = params.get("horizon");
  const domainTags = JSON.parse(params.get("domainTags") || "[]");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);

    const body = {
      userId: "demoUser", // TODO: replace with wallet or real user ID
      riskTolerance: risk,
      markets: markets,
      horizon: horizon,
      domainTags: domainTags,
    };

    try {
      const res = await fetch("http://localhost:8000/persona/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error("Failed to create persona");
      }

      // After saving, proceed to prediction UI
      router.push("/predict");

    } catch (err) {
      console.error(err);
      alert("Something went wrong saving persona.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E0015] text-white px-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-10"
      >
        Review Your Persona
      </motion.h1>

      <div className="bg-white/5 rounded-2xl border border-white/10 p-8 w-full max-w-2xl shadow-xl">
        
        {/* RISK */}
        <div className="mb-6">
          <div className="text-white/50 mb-1 text-sm">Risk Tolerance</div>
          <div className="text-xl font-semibold">{risk}</div>
        </div>

        {/* MARKETS */}
        <div className="mb-6">
          <div className="text-white/50 mb-1 text-sm">Markets</div>
          <div className="flex flex-wrap gap-2">
            {markets.map((m: string) => (
              <span
                key={m}
                className="px-4 py-1 bg-pink-600/40 rounded-full border border-pink-500/40"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* HORIZON */}
        <div className="mb-6">
          <div className="text-white/50 mb-1 text-sm">Prediction Horizon</div>
          <div className="text-xl font-semibold">{horizon}</div>
        </div>

        {/* DOMAINS */}
        <div className="mb-6">
          <div className="text-white/50 mb-1 text-sm">Interests / Domains</div>
          <div className="flex flex-wrap gap-2">
            {domainTags.map((tag: string) => (
              <span
                key={tag}
                className="px-4 py-1 bg-purple-600/40 rounded-full border border-purple-400/40"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={loading}
          className={`w-full mt-6 px-8 py-3 rounded-xl text-lg transition
            ${loading 
              ? "bg-white/10 text-white/30 cursor-not-allowed"
              : "bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90"}
          `}
        >
          {loading ? "Saving..." : "Confirm & Save Persona"}
        </button>
      </div>

      <button
        onClick={() => router.back()}
        className="mt-6 text-white/50 hover:text-white transition"
      >
        Back
      </button>
    </div>
  );
}
