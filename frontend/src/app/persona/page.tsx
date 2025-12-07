"use client";

import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";
const USER_ID = "demo1"; // Hackathon/demo user

type Persona = {
  userId: string;
  riskTolerance: string;
  markets: string[];
  horizon: string;
  domainTags: string[];
  createdAt?: string;
  updatedAt?: string;
};

export default function PersonaPage() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [riskTolerance, setRiskTolerance] = useState("medium");
  const [markets, setMarkets] = useState<string[]>(["BTC"]);
  const [horizon, setHorizon] = useState("24h");
  const [domainTags, setDomainTags] = useState<string[]>(["Crypto"]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  // Load existing persona (if any)
  useEffect(() => {
    const fetchPersona = async () => {
      try {
        const res = await fetch(`${API_BASE}/persona/${USER_ID}`);
        if (!res.ok) return; // persona might not exist yet
        const data = await res.json();
        setPersona(data);
        setRiskTolerance(data.riskTolerance);
        setMarkets(data.markets);
        setHorizon(data.horizon);
        setDomainTags(data.domainTags);
      } catch (e) {
        console.error("Failed to load persona", e);
      }
    };
    fetchPersona();
  }, []);

  const toggleMarket = (symbol: string) => {
    setMarkets((prev) =>
      prev.includes(symbol)
        ? prev.filter((m) => m !== symbol)
        : [...prev, symbol]
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

      const data = await res.json();
      setPersona(data);
      setStatus("Persona saved!");
    } catch (e: any) {
      console.error(e);
      setStatus("Error saving persona");
    } finally {
      setLoading(false);
    }
  };

  const marketButton = (symbol: string) => {
    const active = markets.includes(symbol);
    return (
      <button
        key={symbol}
        type="button"
        onClick={() => toggleMarket(symbol)}
        className={`px-3 py-1 rounded-full border text-sm mr-2 mb-2 ${
          active
            ? "border-emerald-400 bg-emerald-400/10 text-emerald-200"
            : "border-slate-700 hover:border-slate-500 text-slate-300"
        }`}
      >
        {symbol}
      </button>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-2">Your Phi Persona</h1>
      <p className="text-sm text-slate-400 max-w-xl">
        This persona config drives how your AI trading agent behaves: risk
        appetite, markets it cares about, and prediction horizon.
      </p>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left card: summary */}
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400" />
            <div>
              <div className="text-sm text-slate-400">Persona</div>
              <div className="font-medium">Phi Trading Persona</div>
            </div>
          </div>
          <div className="text-sm text-slate-300 space-y-1">
            <div>
              <span className="text-slate-500">User: </span>
              <span className="font-mono text-xs">{USER_ID}</span>
            </div>
            <div>
              <span className="text-slate-500">Risk: </span>
              {riskTolerance}
            </div>
            <div>
              <span className="text-slate-500">Markets: </span>
              {markets.join(", ")}
            </div>
            <div>
              <span className="text-slate-500">Horizon: </span>
              {horizon}
            </div>
            <div>
              <span className="text-slate-500">Tags: </span>
              {domainTags.join(", ")}
            </div>
          </div>
          {persona && (
            <div className="mt-4 text-xs text-slate-500 space-y-1">
              <div>Created: {new Date(persona.createdAt!).toLocaleString()}</div>
              <div>Updated: {new Date(persona.updatedAt!).toLocaleString()}</div>
            </div>
          )}
        </div>

        {/* Right side: form */}
        <div className="md:col-span-2 border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Risk tolerance
            </label>
            <select
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Markets</label>
            <div className="flex flex-wrap">
              {["BTC", "ETH", "SOL", "NEO", "DeFi", "NFTs"].map(marketButton)}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Time horizon
            </label>
            <div className="flex gap-2">
              {["24h", "7d", "30d"].map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    h === horizon
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-200"
                      : "border-slate-700 text-slate-300 hover:border-slate-500"
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Domain tags (comma separated)
            </label>
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
              className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm w-full"
              placeholder="Crypto, DeFi, Macro, Tech..."
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-medium disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Persona"}
            </button>
            {status && (
              <div className="text-xs text-slate-400 font-mono">{status}</div>
            )}
          </div>
        </div>
      </div>

      <p className="text-xs text-slate-500">
        Persona data is stored off-chain (JSON file via FastAPI) for now. In the
        full version, this can be mirrored to NeoFS and tied to NeoID.
      </p>
    </div>
  );
}
