"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function PersonaConfirm() {
  const router = useRouter();
  const params = useSearchParams();

  const risk = params.get("risk");
  const markets = params.get("markets")?.split(",") || [];
  const horizon = params.get("horizon");
  const domains = params.get("domains")?.split(",") || [];

  const [loading, setLoading] = useState(false);

  const submitPersona = async () => {
    setLoading(true);

    const body = {
      userId: "demo-user-1", // You can replace this later
      riskTolerance: risk,
      markets,
      horizon,
      domainTags: domains,
    };

    await fetch("http://localhost:8000/persona/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    router.push("/predict");
  };

  const goBack = () => {
    router.push(
      `/persona/domains?risk=${risk}&markets=${params.get(
        "markets"
      )}&horizon=${horizon}`
    );
  };

  return (
    <div className="min-h-screen bg-[#0E0015] text-white px-6 py-20">

      <div className="flex items-center gap-4 mb-10">
        <button onClick={goBack} className="px-4 py-2 border border-white/20 rounded-lg">
          ← Back
        </button>
        <h1 className="text-3xl font-bold">Confirm Your Persona</h1>
      </div>

      <div className="max-w-xl space-y-6">
        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Risk Tolerance</h2>
          <p className="text-white/70">{risk}</p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Markets</h2>
          <p className="text-white/70">{markets.join(", ")}</p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Prediction Horizon</h2>
          <p className="text-white/70">{horizon}</p>
        </div>

        <div className="p-6 rounded-xl bg-white/5 border border-white/10">
          <h2 className="text-xl font-semibold mb-2">Domains</h2>
          <p className="text-white/70">{domains.join(", ")}</p>
        </div>
      </div>

      <button
        onClick={submitPersona}
        disabled={loading}
        className="mt-10 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-lg disabled:opacity-50"
      >
        {loading ? "Saving..." : "Create Persona →"}
      </button>
    </div>
  );
}
