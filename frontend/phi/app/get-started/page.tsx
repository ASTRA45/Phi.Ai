"use client";

import { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Sparkles, Brain, Settings, Palette } from "lucide-react";

export default function GetStartedPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "system",
      content: "Welcome to the Phi Agent Playground. How can I assist you?",
    },
  ]);

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      {/* CHAT PANEL */}
      <div className="flex flex-col flex-1 bg-white">

        {/* CHAT MESSAGES */}
        <div className="flex-1 overflow-y-auto p-8 relative">

          {/* ⭐ GRID SAMPLE PROMPT CARDS — only when NO user messages yet ⭐ */}
          {messages.length === 1 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 max-w-xl">

                {[
                  {
                    icon: <Sparkles size={28} strokeWidth={1.8} />,
                    title: "Getting Started",
                    prompt: "What can you help me build?",
                    desc: "Learn what Phi.AI can do.",
                  },
                  {
                    icon: <Brain size={28} strokeWidth={1.8} />,
                    title: "Reasoning Agent",
                    prompt: "Create a reasoning agent with memory.",
                    desc: "Build a cognitive workflow.",
                  },
                  {
                    icon: <Settings size={28} strokeWidth={1.8} />,
                    title: "System Tools",
                    prompt: "Show me how Phi agents work.",
                    desc: "Explore system-level tools.",
                  },
                  {
                    icon: <Palette size={28} strokeWidth={1.8} />,
                    title: "Creative Mode",
                    prompt: "Generate a creative agent personality.",
                    desc: "Try expressive behaviors.",
                  },
                ].map((card, i) => (
                  <div
                    key={i}
                    className="
                      sample-card-border rounded-xl cursor-pointer 
                      hover:scale-[1.03] hover:shadow-lg transition-all
                    "
                    onClick={() =>
                      setMessages((prev) => [
                        ...prev,
                        { id: Date.now(), role: 'user', content: card.prompt }
                      ])
                    }
                  >
                    <div className="sample-card-inner rounded-xl p-4 flex flex-col items-center justify-center h-36 text-center">

                      {/* Icon */}
                      <div className="text-gray-800 mb-2">{card.icon}</div>

                      {/* Title */}
                      <div className="font-medium text-gray-900 text-sm">
                        {card.title}
                      </div>

                      {/* Subtitle */}
                      <div className="text-xs text-gray-600 mt-1">
                        {card.desc}
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            </div>
          )}

          {/* NORMAL CHAT MESSAGES */}
          <div className="space-y-6">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xl p-4 rounded-xl border shadow-sm ${
                    m.role === "user"
                      ? "bg-pink-200 border-pink-300 text-gray-800"
                      : "bg-gray-100 border-gray-300 text-gray-800"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            <div ref={messageEndRef} />
          </div>

        </div>

        {/* CHAT INPUT BAR */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">
          <form
            className="flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem(
                "prompt"
              ) as HTMLInputElement;

              const value = input.value.trim();
              if (!value) return;

              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  role: "user",
                  content: value,
                },
              ]);

              input.value = "";
            }}
          >
            {/* Animated Border Wrapper */}
            <div className="animated-border flex-1 rounded-xl">
              <input
                name="prompt"
                placeholder="Ask your agent..."
                className="w-full bg-white px-4 py-3 rounded-xl 
                           text-gray-700 focus:outline-none"
              />
            </div>

            {/* Pink Send Button */}
            <button
              type="submit"
              className="px-6 py-3 rounded-xl text-white font-medium 
                         bg-pink-500 hover:bg-pink-600 transition"
            >
              Send
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}