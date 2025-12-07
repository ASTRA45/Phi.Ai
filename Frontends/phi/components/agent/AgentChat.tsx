"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function AgentChat({ onOutputGenerated }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);

    // Simulate agent deterministic response
    const agentOutput = `Deterministic response for: "${input}"`;

    const aiMsg = { role: "assistant", content: agentOutput };

    setMessages((prev) => [...prev, aiMsg]);
    onOutputGenerated(agentOutput);
    setInput("");
  };

  return (
    <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6 mb-6">
      <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 rounded-xl ${
              m.role === "user"
                ? "bg-violet-600/50 text-white self-end"
                : "bg-white/10 text-gray-200"
            }`}
          >
            {m.content}
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700"
          placeholder="Ask the Phi agent something..."
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-pink-600 rounded-xl hover:bg-pink-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
