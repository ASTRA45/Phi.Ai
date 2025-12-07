"use client";

import React, { useState } from "react";
import { Volume2, Loader2 } from "lucide-react";

/* -------------------------------
   FIXED TTS — NO BACKEND REQUIRED
-------------------------------- */
function playAudio(text: string) {
  try {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.error("Browser does not support speech.");
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    synth.speak(utter);
  } catch (err) {
    console.error("TTS error:", err);
  }
}

export default function GetStartedPage() {
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState("");

  const sendMessage = async () => {
    setLoading(true);
    setResponseText("");

    try {
      // Your existing chat request → kept as-is
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "Start" })
      });

      if (!res.ok) {
        throw new Error("GPT request failed.");
      }

      const data = await res.json();
      setResponseText(data.reply);

      // 🔊 FIX — Use browser speech instead of failing /api/tts
      playAudio(data.reply);

    } catch (err) {
      console.error("Chat failure:", err);
      setResponseText("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Get Started</h1>

      <button
        onClick={sendMessage}
        disabled={loading}
        className="px-5 py-2 bg-purple-600 rounded-full flex items-center gap-2 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" /> : <Volume2 />}
        Start Conversation
      </button>

      {responseText && (
        <div className="mt-6 p-4 bg-white/10 rounded-xl text-sm">
          {responseText}
        </div>
      )}
    </div>
  );
}
