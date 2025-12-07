"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Volume2 } from "lucide-react";

// ------------------------------------------------------
// 🔎 Natural Language → Event ID Mapping
// ------------------------------------------------------
function extractEventIdFromInput(text: string): string {
  const t = text.toLowerCase();

  if (t.includes("bitcoin") || t.includes("btc")) return "btc-up";
  if (t.includes("ethereum") || t.includes("eth")) return "eth-up";
  if (t.includes("trump") || t.includes("president")) return "trump-win";
  if (t.includes("stock") || t.includes("market")) return "stocks-up";

  return "generic-event";
}

export default function GetStartedPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "system",
      content:
        "👋 Welcome to the Phi Agent Playground!\nAsk anything — I will generate a structured prediction + GPT commentary.",
    },
  ]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ----------------------------------------
  // 🔊 Text To Speech (TTS)
  // ----------------------------------------
  const playAudio = async (text: string) => {
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) return console.error("TTS failed");

      const audioBlob = await res.blob();
      const url = URL.createObjectURL(audioBlob);

      new Audio(url).play();
    } catch (err) {
      console.error("TTS error:", err);
    }
  };

  // --------------------------------------------------------
  // 🚀 MAIN SEND HANDLER — PRETTY COMBINED ASSISTANT MESSAGE
  // --------------------------------------------------------
  const handleSend = async (text: string) => {
    // Display user message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", content: text },
    ]);

    const eventId = extractEventIdFromInput(text);

    try {
      // 1️⃣ Fetch prediction
      const predRes = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "demoUser",
          eventId,
          seed: Math.floor(Math.random() * 10000),
        }),
      });

      const prediction = await predRes.json();

      const predictionSection = `
🎯 **Event:** \`${eventId}\`
📈 **Probability Up:** ${prediction.probabilityUp}
🔍 **Confidence:** ${prediction.confidence}
⚠️ **Risk Tier:** ${prediction.riskTier}

📝 **Reasons**
${prediction.explanationBullets.map((b: string) => `• ${b}`).join("\n")}
`.trim();

      // 2️⃣ GPT Commentary
      const chatRes = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const chatData = await chatRes.json();
      const gptReply = chatData.reply || "No GPT response.";

      const gptSection = `
🤖 **GPT Commentary**
${gptReply}
`.trim();

      // 3️⃣ Combine beautifully
      const combinedPretty = `
✨ **Prediction Result**

${predictionSection}

---

${gptSection}
      `.trim();

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "assistant", content: combinedPretty },
      ]);

      playAudio(combinedPretty);
    } catch (err) {
      console.error("Prediction/GPT error:", err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content:
            "⚠️ Something went wrong while generating your prediction or commentary.",
        },
      ]);
    }
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <div className="flex h-screen overflow-hidden bg-[#20002E]">
      <Sidebar />

      <div className="flex flex-col flex-1 bg-[#1A0221] text-white">
        {/* HEADER */}
        <div className="px-10 py-6 border-b border-[#7C085A]/30">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#CF268A]" />
            Phi Agent Playground
          </h1>
          <p className="text-sm text-white/60">
            Deterministic, verifiable agents powered by SpoonOS + Neo.
          </p>
        </div>

        {/* CHAT */}
        <div className="flex-1 px-10 py-10 overflow-y-auto">
          <div className="space-y-6 mt-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`
                    relative max-w-xl p-5 rounded-xl border leading-relaxed whitespace-pre-wrap
                    ${
                      m.role === "user"
                        ? "bg-[#AF1281] border-[#CF268A]"
                        : "bg-[#360167]/40 border-[#6B0772]"
                    }
                  `}
                >
                  {m.content}

                  {m.role === "assistant" && (
                    <button
                      onClick={() => playAudio(m.content)}
                      className="absolute -right-10 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <Volume2 size={22} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* INPUT */}
        <div className="border-t border-[#6B0772]/40 px-8 py-6">
          <form
            className="flex items-center gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem(
                "prompt"
              ) as HTMLInputElement;

              if (!input.value.trim()) return;

              const text = input.value.trim();
              input.value = "";
              handleSend(text);
            }}
          >
            <input
              name="prompt"
              placeholder="Ask your agent anything..."
              className="flex-1 bg-[#360167]/40 border border-[#7C085A]/40 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none"
            />

            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-white font-medium bg-[#AF1281] hover:bg-[#CF268A] transition"
            >
              Predict
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
