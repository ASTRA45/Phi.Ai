"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Lucide icons (optional, just for visuals)
import {
  ShieldCheck,
  Gauge,
  AlertTriangle,
  Coins,
  LineChart,
  Trophy,
  Landmark,
  Globe,
  Clock,
  Calendar,
  Hourglass,
  Timer,
} from "lucide-react";

const API_BASE = "http://localhost:8000";
const USER_ID = "demoUser"; // make sure this matches your backend expectations

type Persona = {
  userId: string;
  riskTolerance: string;
  markets: string[];
  horizon: string;
  domainTags: string[];
  createdAt?: string;
  updatedAt?: string;
};

// Card animation helper
const cardVariant = (delay: number) => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { delay } },
});

const RISK_OPTIONS = [
  {
    id: "low",
    title: "Low Risk",
    desc: "Safe, steady, conservative forecasting.",
    icon: <ShieldCheck size={40} className="text-[#45FFC2]" />,
  },
  {
    id: "medium",
    title: "Medium Risk",
    desc: "Balanced, reasonable predictions.",
    icon: <Gauge size={40} className="text-[#CF268A]" />,
  },
  {
    id: "high",
    title: "High Risk",
    desc: "Aggressive, high-volatility forecasting.",
    icon: <AlertTriangle size={40} className="text-[#FF3B7B]" />,
  },
];

const MARKET_OPTIONS = [
  { id: "crypto", label: "Crypto", icon: <Coins size={32} className="text-[#CF268A]" /> },
  { id: "stocks", label: "Stocks", icon: <LineChart size={32} className="text-[#45FFC2]" /> },
  { id: "sports", label: "Sports", icon: <Trophy size={32} className="text-[#FF3B7B]" /> },
  { id: "politics", label: "Politics", icon: <Landmark size={32} className="text-[#AF1281]" /> },
  { id: "economics", label: "Economics", icon: <Globe size={32} className="text-[#8A56FF]" /> },
];

const HORIZON_OPTIONS = [
  { id: "1d", label: "1 Day", icon: <Clock size={32} className="text-[#CF268A]" /> },
  { id: "7d", label: "7 Days", icon: <Calendar size={32} className="text-[#45FFC2]" /> },
  { id: "30d", label: "30 Days", icon: <Hourglass size={32} className="text-[#FF3B7B]" /> },
  { id: "90d", label: "90 Days", icon: <Timer size={32} className="text-[#8A56FF]" /> },
];

export default function PersonaPage() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [markets, setMarkets] = useState<string[]>(["crypto"]);
  const [horizon, setHorizon] = useState("7d");
  const [domainTags, setDomainTags] = useState<string[]>(["Crypto"]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Load existing persona (if any)
  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const res = await fetch(`${API_BASE}/persona/${USER_ID}`);
        if (!res.ok) return; // persona might not exist yet
        const data: Persona = await res.json();

        setPersona(data);
        setRiskTolerance(data.riskTolerance || "medium");
        setMarkets(data.markets || []);
        setHorizon(data.horizon || "7d");
        setDomainTags(data.domainTags || []);
      } catch (e) {
        console.error("Failed to load persona", e);
      }
    };
    fetchPersona();
  }, []);

  const toggleMarket = (id: string) => {
    setMarkets((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${API_BASE}/persona/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: USER_ID,
          riskTolerance,
          markets,
          horizon,
          domainTags,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: Persona = await res.json();
      setPersona(data);
      setStatus("Persona saved!");
    } catch (e) {
      console.error(e);
      setStatus("Error saving persona");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0015] text-white px-6 py-16 flex flex-col items-center relative">
      {/* Aurora-ish background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(175,18,129,0.35),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(54,1,103,0.35),transparent)]" />

      <div className="relative w-full max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-3">Your Phi Persona</h1>
          <p className="text-sm text-white/60 max-w-xl">
            This persona config drives how your AI trading / prediction agent behaves:
            risk appetite, markets it cares about, and prediction horizon.
          </p>
        </motion.div>

        {/* Top row: Summary card + meta info */}
        <motion.div
          variants={cardVariant(0.1)}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="md:col-span-2 p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400" />
              <div>
                <div className="text-xs text-white/50">Persona</div>
                <div className="text-lg font-semibold">Phi Trading Persona</div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/50 block text-xs mb-1">User</span>
                <span className="font-mono text-xs bg-black/40 px-2 py-1 rounded-md">
                  {USER_ID}
                </span>
              </div>

              <div>
                <span className="text-white/50 block text-xs mb-1">
                  Risk Tolerance
                </span>
                <span className="capitalize">{riskTolerance}</span>
              </div>

              <div>
                <span className="text-white/50 block text-xs mb-1">Markets</span>
                <span>{markets.join(", ") || "—"}</span>
              </div>

              <div>
                <span className="text-white/50 block text-xs mb-1">
                  Prediction Horizon
                </span>
                <span>{horizon || "—"}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-white/50 block text-xs mb-1">
                  Domain Tags
                </span>
                <span>{domainTags.join(", ") || "—"}</span>
              </div>
            </div>

            {persona && (
              <div className="mt-4 text-[11px] text-white/40 space-y-1">
                {persona.createdAt && (
                  <div>
                    Created:{" "}
                    {new Date(persona.createdAt).toLocaleString()}
                  </div>
                )}
                {persona.updatedAt && (
                  <div>
                    Updated:{" "}
                    {new Date(persona.updatedAt).toLocaleString()}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="p-6 rounded-2xl border border-white/10 bg-black/40 text-xs text-white/60 space-y-2">
            <div className="font-semibold text-sm text-white">
              What is a Persona?
            </div>
            <p>
              Your persona tells the Phi agent how bold it should be, which
              markets to track, and over what time horizon to optimise.
            </p>
            <p>
              This data is currently stored off-chain (JSON via FastAPI). In a
              full version it can be mirrored to NeoFS and tied to NeoID.
            </p>
          </div>
        </motion.div>

        {/* Risk card */}
        <motion.div
          variants={cardVariant(0.2)}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Risk Tolerance</h2>
            <span className="text-xs text-white/50">
              Choose how aggressive you want the agent to be.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RISK_OPTIONS.map((opt) => {
              const active = opt.id === riskTolerance;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRiskTolerance(opt.id)}
                  className={`p-5 rounded-2xl border text-left transition flex flex-col gap-2
                    ${
                      active
                        ? "border-[#CF268A] bg-[#360167]/40 shadow-[0_0_25px_#CF268A80]"
                        : "border-white/10 bg-white/5 hover:border-[#AF1281]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div>{opt.icon}</div>
                    <div className="font-semibold">{opt.title}</div>
                  </div>
                  <p className="text-xs text-white/70">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Markets card */}
        <motion.div
          variants={cardVariant(0.3)}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Markets</h2>
            <span className="text-xs text-white/50">
              Pick the areas you care about most.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {MARKET_OPTIONS.map((opt) => {
              const active = markets.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleMarket(opt.id)}
                  className={`p-5 rounded-2xl border flex items-center gap-3 text-left transition
                    ${
                      active
                        ? "border-[#CF268A] bg-[#CF268A]/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }
                  `}
                >
                  {opt.icon}
                  <span className="text-sm font-semibold">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Horizon card */}
        <motion.div
          variants={cardVariant(0.4)}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Prediction Horizon</h2>
            <span className="text-xs text-white/50">
              How far into the future should the agent optimise?
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {HORIZON_OPTIONS.map((opt) => {
              const active = horizon === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setHorizon(opt.id)}
                  className={`p-5 rounded-2xl border flex flex-col items-center gap-2 text-center transition
                    ${
                      active
                        ? "border-[#CF268A] bg-[#CF268A]/20"
                        : "border-white/10 bg-white/5 hover:bg-white/10"
                    }
                  `}
                >
                  <div>{opt.icon}</div>
                  <div className="text-sm font-semibold">{opt.label}</div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Domain tags */}
        <motion.div
          variants={cardVariant(0.5)}
          initial="hidden"
          animate="visible"
          className="mb-10"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Domains / Tags</h2>
            <span className="text-xs text-white/50">
              Comma-separated tags like: Crypto, DeFi, Macro, Tech...
            </span>
          </div>

          <input
            type="text"
            value={domainTags.join(", ")}
            onChange={(e) =>
              setDomainTags(
                e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
              )
            }
            className="bg-black/40 border border-white/15 rounded-xl px-4 py-3 text-sm w-full focus:outline-none focus:border-[#CF268A]"
            placeholder="Crypto, DeFi, Macro, Tech..."
          />
        </motion.div>

        {/* Save button & status */}
        <motion.div
          variants={cardVariant(0.6)}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between gap-4 flex-wrap"
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Persona"}
          </button>

          {status && (
            <div className="text-xs text-white/60 font-mono">{status}</div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
