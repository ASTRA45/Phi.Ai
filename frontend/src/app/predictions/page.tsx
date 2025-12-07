"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Zap,
  CreditCard,
  X,
  Activity,
  Clock,
  Volume2,
} from "lucide-react";

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

/* ------------------------------------------
   FIXED TTS — browser-native speech synthesis
   (No backend needed, no /tts calls)
------------------------------------------- */
function playAudioSummary(text: string) {
  try {
    const synth = window.speechSynthesis;

    if (!synth) {
      console.error("Speech synthesis not supported");
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.02;
    utter.pitch = 1.0;
    utter.volume = 1.0;
    synth.speak(utter);
  } catch (err) {
    console.error("TTS error:", err);
  }
}

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
  const [showX402Drawer, setShowX402Drawer] = useState(false);

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
      if (useX402) {
        setPaymentStatus("Requesting x402 payment header...");
        const resPay = await fetch(`${API_BASE}/x402/demo-payment`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resource: `phi://prediction/${eventId}`,
          }),
        });

        if (!resPay.ok) throw new Error(`x402 HTTP ${resPay.status}`);

        const pay = await resPay.json();
        setPaymentHeader(pay.paymentHeader);
        setPaymentStatus(
          `x402 payment prepared: ${pay.amountUsdc} USDC on base-sepolia`
        );

        setShowX402Drawer(true);
      }

      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: USER_ID, eventId }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

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
    <div className="min-h-screen bg-[#0E0015] text-white relative">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(175,18,129,0.35),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(54,1,103,0.35),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* HEADER */}
        <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Activity className="text-[#CF268A]" />
              Predictions
            </h1>
            <p className="text-sm text-white/60 max-w-xl mt-1">
              Persona + SpoonOS agent → prediction → JSON → optional Neo/NeoFS publishing.
              With x402, each prediction call can be pay-per-use.
            </p>
          </div>

          {pingResult && (
            <div className="text-[11px] text-white/60 font-mono border border-white/15 rounded-xl px-3 py-2 bg-black/40">
              Backend health: {pingResult}
            </div>
          )}
        </header>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)]">
          {/* LEFT PANEL */}
          <div className="space-y-6">
            {/* CONTROL CARD */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/10 rounded-2xl p-5 bg-black/40 backdrop-blur-sm space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-medium mb-1 text-white/70">
                    Event / Market
                  </label>
                  <select
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                    className="bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:border-[#CF268A]"
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
                    className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Zap size={16} />
                    {loading ? "Generating..." : "Generate Prediction"}
                  </button>

                  <button
                    type="button"
                    onClick={pingBackend}
                    className="px-4 py-1.5 rounded-full border border-white/20 text-[11px] text-white/80 hover:bg-white/10"
                  >
                    Ping backend
                  </button>
                </div>
              </div>

              {/* X402 TOGGLE */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10 mt-2 pt-3">
                <label className="inline-flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useX402}
                    onChange={(e) => setUseX402(e.target.checked)}
                    className="accent-[#CF268A]"
                  />
                  <span className="flex items-center gap-1">
                    <CreditCard size={14} className="text-[#CF268A]" />
                    Use x402 payment for this prediction
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowX402Drawer(true)}
                  disabled={!paymentStatus && !paymentHeader}
                  className="text-[11px] px-3 py-1 rounded-full border border-white/15 hover:bg-white/10 disabled:opacity-40 flex items-center gap-1"
                >
                  <CreditCard size={14} />
                  View x402 details
                </button>
              </div>
            </motion.div>

            {/* CHAT PANEL */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-white/10 rounded-2xl p-5 bg-black/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-2 mb-4 text-xs text-white/60">
                <MessageCircle size={16} className="text-[#CF268A]" />
                <span>Prediction Chat</span>
              </div>

              {!current && (
                <div className="text-xs text-white/50">
                  No predictions yet. Select an event and click{" "}
                  <span className="text-[#CF268A] font-semibold">Generate Prediction</span>.
                </div>
              )}

              {current && (
                <div className="space-y-4">
                  {/* USER BUBBLE */}
                  <div className="flex justify-end">
                    <div className="max-w-[80%]">
                      <div className="text-[10px] text-white/40 mb-1 text-right">
                        You •{" "}
                        {new Date(current.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>

                      <div className="rounded-2xl rounded-br-sm bg-[#360167]/60 border border-[#CF268A]/60 px-4 py-2 text-xs shadow-[0_0_15px_#CF268A50]">
                        Ask Phi to predict{" "}
                        <span className="font-semibold">{current.eventId}</span>.
                      </div>
                    </div>
                  </div>

                  {/* AGENT BUBBLE */}
                  <div className="flex justify-start">
                    <div className="max-w-[85%]">
                      <div className="text-[10px] text-white/40 mb-1">
                        Phi Agent • {current.agentVersion}
                      </div>

                      <div className="rounded-2xl rounded-bl-sm bg-white/5 border border-white/15 px-4 py-3 text-xs space-y-2">
                        {/* 🔊 TTS BUTTON (browser-native) */}
                        <button
                          type="button"
                          onClick={() =>
                            playAudioSummary(
                              `Prediction summary for ${current.eventId}. 
                              Probability up ${Math.round(
                                current.probabilityUp * 100
                              )} percent. 
                              Confidence ${Math.round(
                                current.confidence * 100
                              )} percent. 
                              Risk tier ${current.riskTier}.`
                            )
                          }
                          className="flex items-center gap-1 px-2 py-1 border border-white/20 rounded-full text-[11px] hover:bg-white/10"
                        >
                          <Volume2 size={12} /> Play Audio
                        </button>

                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                            ↑ {fmtPct(current.probabilityUp)} up
                          </span>
                          <span className="text-[11px] px-2 py-1 rounded-full bg-sky-500/15 text-sky-200 border border-sky-400/40">
                            {Math.round(current.confidence * 100)}% conf.
                          </span>
                          <span className="text-[11px] px-2 py-1 rounded-full bg-purple-500/15 text-purple-200 border border-purple-400/40 capitalize">
                            {current.riskTier}
                          </span>

                          <span className="text-[11px] text-white/40 flex items-center gap-1 ml-auto">
                            <Clock size={12} />
                            {new Date(current.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <ul className="list-disc list-inside space-y-1 text-[11px] text-white/80 mt-2">
                          {current.explanationBullets.map((b, i) => (
                            <li key={i}>{b}</li>
                          ))}
                        </ul>

                        <div className="text-[10px] text-white/40 mt-2 space-y-1">
                          <div>
                            Seed:{" "}
                            <span className="font-mono">
                              {current.seed.toFixed(4)}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <span>
                              Tx:{" "}
                              {current.txHash ? (
                                <span className="font-mono text-[10px]">
                                  {current.txHash}
                                </span>
                              ) : (
                                "n/a (stub)"
                              )}
                            </span>

                            <span>
                              NeoFS:{" "}
                              {current.neofsObjectId ? (
                                <span className="font-mono text-[10px]">
                                  {current.neofsObjectId}
                                </span>
                              ) : (
                                "n/a (stub)"
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 text-[11px] text-red-300 bg-red-900/40 border border-red-700 rounded-xl px-3 py-2">
                  {error}
                </div>
              )}
            </motion.div>
          </div>

          {/* RIGHT SIDE — HISTORY */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-white/10 rounded-2xl p-5 bg-black/40 backdrop-blur-sm flex flex-col gap-4"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold flex items-center gap-2">
                <Activity size={16} className="text-[#CF268A]" />
                History
              </div>
              <div className="text-[11px] text-white/50">
                {history.length} predictions
              </div>
            </div>

            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {history.length === 0 && (
                <div className="text-[11px] text-white/50">
                  No predictions yet.
                </div>
              )}

              {history.map((p) => (
                <div
                  key={p.id}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[11px] space-y-1.5 hover:border-[#CF268A]/70 transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-mono text-[10px] text-white/70">
                      {p.eventId}
                    </div>
                    <div className="text-white/40">
                      {new Date(p.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/40">
                      ↑ {fmtPct(p.probabilityUp)}
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-200 border border-sky-400/40">
                      {Math.round(p.confidence * 100)}% conf.
                    </span>

                    <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-200 border border-purple-400/40 capitalize">
                      {p.riskTier}
                    </span>
                  </div>

                  <div className="text-white/40 flex justify-between items-center">
                    <span className="truncate">
                      Tx:{" "}
                      {p.txHash ? (
                        <span className="font-mono text-[9px]">
                          {p.txHash.slice(0, 12)}…
                        </span>
                      ) : (
                        "stub"
                      )}
                    </span>

                    <span className="text-[9px]">
                      Seed {p.seed.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* X402 DRAWER, unchanged */}
      {showX402Drawer && (
        <div className="fixed inset-0 z-40 flex justify-end">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowX402Drawer(false)}
          />

          <div className="relative z-50 w-full max-w-md h-full bg-[#05000A] border-l border-white/15 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/15">
              <div className="flex items-center gap-2">
                <CreditCard className="text-[#CF268A]" size={18} />
                <div className="text-sm font-semibold">x402 Payment Details</div>
              </div>

              <button
                type="button"
                onClick={() => setShowX402Drawer(false)}
                className="p-1 rounded-full hover:bg-white/10"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 text-xs text-white/80">
              {!useX402 && (
                <div className="text-white/40 text-[11px]">
                  x402 is currently disabled.
                </div>
              )}

              {useX402 && (
                <>
                  <div className="border border-white/15 rounded-xl p-3 bg-white/5">
                    <div className="text-[11px] text-white/60 mb-1">Status</div>
                    <div className="text-xs">
                      {paymentStatus || "No payment prepared yet."}
                    </div>
                  </div>

                  <div className="border border-white/15 rounded-xl p-3 bg-black/60">
                    <div className="text-[11px] text-white/60 mb-1">
                      Payment header
                    </div>

                    {paymentHeader ? (
                      <div className="font-mono text-[10px] break-all">
                        {paymentHeader}
                      </div>
                    ) : (
                      <div className="text-[11px] text-white/40">
                        Call "Generate Prediction" with x402 enabled.
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] text-white/50 space-y-1">
                    <div className="font-semibold text-white/70">How it works</div>
                    <p>
                      Backend uses Spoon x402 CLI to sign temporary pay-per-call
                      headers.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 py-3 border-t border-white/15 text-[11px] text-white/50">
              Close this panel after reviewing.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
