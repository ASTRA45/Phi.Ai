"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function GetStartedPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "system",
      content: "Welcome to the Phi Agent Playground. How can I assist you?",
    },
  ]);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN CHAT AREA */}
      <div className="flex flex-col flex-1 bg-white">

        {/* MESSAGES DISPLAY */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((m) => (
            <div key={m.id} className="max-w-3xl">
              <div
                className="p-4 rounded-xl bg-gray-100 
                           border border-gray-300 shadow-sm 
                           text-gray-800"
              >
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* CHAT INPUT SECTION */}
        <div className="border-t border-gray-200 bg-white px-6 py-4">

          <form
            className="flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const input = e.currentTarget.elements.namedItem(
                "prompt"
              ) as HTMLInputElement;

              if (!input.value.trim()) return;

              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  role: "user",
                  content: input.value,
                },
              ]);

              input.value = "";
            }}
          >
            {/* Animated Gradient Border */}
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
