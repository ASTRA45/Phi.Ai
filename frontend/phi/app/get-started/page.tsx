"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function GetStartedPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: "system", content: "Welcome to the Phi Agent Playground. How can I assist you?" }
  ]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#20002E]">

      <Sidebar />

      {/* Main Chat Panel */}
      <div className="flex flex-col flex-1 bg-[#1A0221] text-white">

        {/* Header */}
        <div className="px-10 py-6 border-b border-[#7C085A]/30">
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#CF268A]"></div>
            Phi Agent Playground
          </h1>
          <p className="text-sm text-white/60">
            Deterministic, verifiable agents powered by SpoonOS + Neo.
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 relative px-10 py-10">

          {/* Prompt Cards (only initially) */}
          {messages.length === 1 && (
            <div className="grid grid-cols-2 gap-6 max-w-3xl">

              {[
                {
                  title: "Getting Started",
                  icon: "💡",
                  desc: "Explore what Phi.ai can do.",
                  prompt: "What can you help me build?",
                },
                {
                  title: "Reasoning Agent",
                  icon: "🧠",
                  desc: "Create a cognitive agent with memory.",
                  prompt: "Create a reasoning agent with memory.",
                },
                {
                  title: "System Tools",
                  icon: "⚙️",
                  desc: "See agents wired into SpoonOS tools.",
                  prompt: "Show me how Phi agents work with SpoonOS tools.",
                },
                {
                  title: "On-Chain Verifiability",
                  icon: "🔗",
                  desc: "Connect agents to Neo blockchain logs.",
                  prompt: "Set up an agent with on-chain verification.",
                },
              ].map((card, i) => (
                <button
                  key={i}
                  onClick={() =>
                    setMessages((prev) => [
                      ...prev,
                      { id: Date.now(), role: "user", content: card.prompt },
                    ])
                  }
                  className="bg-[#360167]/40 border border-[#AF1281]/20 rounded-xl p-6 text-left hover:bg-[#360167]/60 transition"
                >
                  <div className="text-3xl mb-2">{card.icon}</div>
                  <div className="text-lg font-semibold">{card.title}</div>
                  <div className="text-white/60">{card.desc}</div>
                </button>
              ))}

            </div>
          )}

          {/* Messages */}
          <div className="space-y-6 mt-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-xl p-4 rounded-xl border
                    ${
                      m.role === "user"
                        ? "bg-[#AF1281] border-[#CF268A] text-white"
                        : "bg-[#360167]/40 border-[#6B0772] text-white"
                    }
                  `}
                >
                  {m.content}
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-[#6B0772]/40 px-8 py-6">
          <form
            className="flex items-center gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              const input = (e.currentTarget.elements.namedItem("prompt") as HTMLInputElement);
              if (!input.value.trim()) return;

              setMessages((prev) => [
                ...prev,
                { id: Date.now(), role: "user", content: input.value },
              ]);

              input.value = "";
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
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
