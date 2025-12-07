"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";

export default function GetStartedPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: "system", content: "Welcome to the Phi Agent Playground. How can I assist you?" },
  ]);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <div className="flex flex-col flex-1">

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`max-w-3xl ${
                m.role === "system" ? "text-gray-400" : "text-white"
              }`}
            >
              <div className="p-4 rounded-lg bg-muted/20 border border-muted">
                {m.content}
              </div>
            </div>
          ))}
        </div>

        {/* Chat Input */}
        <div className="border-t px-6 py-4">
          <form
            className="flex items-center gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = (form.elements.namedItem("prompt") as HTMLInputElement);
              const value = input.value.trim();
              if (!value) return;

              setMessages((prev) => [
                ...prev,
                { id: Date.now(), role: "user", content: value },
              ]);

              input.value = "";
            }}
          >
            <input
              name="prompt"
              placeholder="Ask your agent..."
              className="flex-1 rounded-xl border bg-muted/10 px-4 py-3 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-xl"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
