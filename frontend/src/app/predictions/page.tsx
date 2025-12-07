"use client";

import React, { useEffect, useState } from "react";

const API_BASE = "http://localhost:8000";
const USER_ID = "demo1";

type Prediction = {
  id: string;
  userId: string;
  eventId: string;
  probabilityUp: number;
  confidence: number;
  riskTier: string;
  seed: number;
  explanationBullets: string[];
  agentVersion: string;
  txHash: string | null;
  neofsObjectId: string | null;
  createdAt: string;
};

export default function PredictionsPage() {
  const [eventId, setEventId] = useState("BTC_24h");
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<Prediction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pingResult, setPingResult] = useState<string | null>(null);

  const [useX402, setUseX402] = useState(false);
  const [paymentHeader, setPaymentHeader] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);

  const fmtPct = (x: number) => `${Math.round(x * 100)}%`;

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/predictions/${USER_ID}`);
      if (!res.ok) return;
      const data: Prediction[] = await res.json();
      setHistory(
        data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      );
    } catch (e) {
      console.error("Failed to fetch history", e);
    }
  };

  const pingBackend = async () => {
    setPingResult("Pinging...");
    try {
      const res = await fetch(`${API_BASE}/health`);
      const text = await res.text();
      setPingResult(`OK: ${text}`);
    } catch (e: any) {
      console.error("Ping failed", e);
      setPingResult(`Error: ${e?.message ?? "unknown"}`);
    }
  };

  // On mount: ping backend + load history
  useEffect(() => {
    pingBackend();
    fetchHistory();
  }, []);

  const callPredict = async () => {
    setLoading(true);
    setError(null);
    setPaymentStatus(null);
    setPaymentHeader(null);

    try {
      // Optional x402 step
      if (useX402) {
        setPaymentStatus("Requesting x402 payment header...");
        const resPay = await fetch(`${API_BASE}/x402/demo-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resource: `phi://prediction/${eventId}`,
          }),
        });

        if (!resPay.ok) {
          throw new Error(`x402 HTTP ${resPay.status}`);
        }

        const pay = await resPay.json();
        setPaymentHeader(pay.paymentHeader);
        setPaymentStatus(
          `x402 payment prepared: ${pay.amountUsdc} USDC on base-sepolia`
        );
      }

      // Main prediction call
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, eventId }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data: Prediction = await res.json();
      setCurrent(data);
      setHistory((prev) => [data, ...prev]);
    } catch (e: any) {
      console.error(e);
      setError(e?.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold mb-2">Predictions</h1>
      <p className="text-sm text-slate-400 max-w-xl">
        This calls your Phi.ai backend: persona + SpoonOS agent → prediction →
        JSON → optional Neo/NeoFS publishing. With x402, you can make each call
        pay-per-prediction.
      </p>

      {pingResult && (
        <div className="text-xs text-slate-400 font-mono mb-2">
          Backend health: {pingResult}
        </div>
      )}

      {/* Controls */}
      <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">
              Event / Market
            </label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-sm w-full"
            >
              <option value="BTC_24h">BTC 24h</option>
              <option value="ETH_7d">ETH 7d</option>
              <option value="NEO_7d">NEO 7d</option>
              <option value="BTC_30d">BTC 30d</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={callPredict}
              disabled={loading}
              className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-400 text-slate-950 text-sm font-medium disabled:opacity-60"
            >
              {loading ? "Generating..." : "Generate Prediction"}
            </button>
            <button
              type="button"
              onClick={pingBackend}
              className="px-3 py-1 rounded-md border border-slate-700 text-xs text-slate-300 hover:border-slate-500"
            >
              Ping backend
            </button>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={useX402}
            onChange={(e) => setUseX402(e.target.checked)}
          />
          <span>
            Use x402 payment for this prediction (Base Sepolia USDC fee)
          </span>
        </label>

        {paymentStatus && (
          <div className="text-xs text-slate-400 font-mono">
            {paymentStatus}
          </div>
        )}
        {paymentHeader && (
          <div className="text-[10px] text-slate-300 font-mono break-all border border-slate-800 rounded-md px-3 py-2 bg-slate-950/60">
            X-PAYMENT: {paymentHeader}
          </div>
        )}
      </div>

      {/* Current prediction */}
      {current && (
        <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/60 space-y-3">
          <div className="flex flex-wrap justify-between gap-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">
                Current Prediction
              </div>
              <div className="text-lg font-semibold">
                {current.eventId}:{" "}
                <span className="text-emerald-400">
                  {fmtPct(current.probabilityUp)} chance UP
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Confidence:{" "}
                <span className="text-sky-300">
                  {Math.round(current.confidence * 100)}%
                </span>{" "}
                · Risk tier:{" "}
                <span className="capitalize">{current.riskTier}</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 text-right">
              <div>Seed: {current.seed.toFixed(4)}</div>
              <div>
                At: {new Date(current.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="mt-1">Agent: {current.agentVersion}</div>
            </div>
          </div>

          <ul className="list-disc list-inside text-sm text-slate-200 space-y-1">
            {current.explanationBullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>

          <div className="text-xs text-slate-500 flex flex-wrap gap-3">
            <span>
              Tx hash:{" "}
              {current.txHash ? (
                <span className="font-mono">{current.txHash}</span>
              ) : (
                "n/a (stubbed)"
              )}
            </span>
            <span>
              NeoFS object:{" "}
              {current.neofsObjectId ? (
                <span className="font-mono">{current.neofsObjectId}</span>
              ) : (
                "n/a (stubbed)"
              )}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="text-xs text-red-400 bg-red-950/40 border border-red-800 rounded-md px-3 py-2">
          {error}
        </div>
      )}

      {/* History table */}
      <div className="border border-slate-800 rounded-xl p-4 bg-slate-900/40">
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm font-medium">History</div>
          <div className="text-xs text-slate-500">
            Total: {history.length} predictions
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="border-b border-slate-800 text-slate-500">
              <tr>
                <th className="py-1 pr-4">Time</th>
                <th className="py-1 pr-4">Event</th>
                <th className="py-1 pr-4">Prob ↑</th>
                <th className="py-1 pr-4">Conf.</th>
                <th className="py-1 pr-4">Risk</th>
                <th className="py-1 pr-4">Tx</th>
              </tr>
            </thead>
            <tbody>
              {history.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-900/60 hover:bg-slate-900/70"
                >
                  <td className="py-1 pr-4 text-slate-400">
                    {new Date(p.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-1 pr-4">{p.eventId}</td>
                  <td className="py-1 pr-4">{fmtPct(p.probabilityUp)}</td>
                  <td className="py-1 pr-4">
                    {Math.round(p.confidence * 100)}%
                  </td>
                  <td className="py-1 pr-4 capitalize">{p.riskTier}</td>
                  <td className="py-1 pr-4">
                    {p.txHash ? (
                      <span className="font-mono text-[10px]">
                        {p.txHash.slice(0, 10)}…
                      </span>
                    ) : (
                      <span className="text-slate-500">stub</span>
                    )}
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="py-3 text-center text-slate-500 text-xs"
                  >
                    No predictions yet. Run one above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
