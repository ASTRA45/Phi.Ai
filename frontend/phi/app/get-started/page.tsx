"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function GetStartedPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Welcome to the Phi Agent Playground. How can I assist you?" }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");

    // TEMPORARY MOCK AI RESPONSE (until backend is connected)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "This is a placeholder response from Phi Agent." }
      ]);
    }, 600);
  };

  return (
    <div className="flex min-h-screen w-full bg-black text-white">
      
      {/* Sidebar */}
      <div className="w-64 border-r border-white/10 p-6 flex flex-col gap-6">
        <h2 className="text-xl font-bold">Phi Agents</h2>

        <div className="space-y-3">
          <Button className="w-full bg-white text-black">Default Agent</Button>
          <Button variant="outline" className="w-full">
            Research Agent
          </Button>
          <Button variant="outline" className="w-full">
            Blockchain Agent
          </Button>
          <Button variant="outline" className="w-full">
            Custom Agent
          </Button>
        </div>

        <div className="mt-auto">
          <p className="text-sm text-gray-400">Logged in as:</p>
          <p className="text-white font-semibold">0xYourAddress</p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <h1 className="text-2xl font-bold">Agent Chat</h1>
          <p className="text-gray-400 text-sm">Powered by SpoonOS + X402</p>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 max-w-xl rounded-xl ${
                m.role === "user"
                  ? "bg-white text-black ml-auto"
                  : "bg-gray-800 text-white"
              }`}
            >
              {m.content}
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-3">
          <input
            className="flex-1 p-3 rounded-xl bg-gray-900 border border-white/10 text-white"
            placeholder="Ask your agent..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <Button className="px-6 bg-white text-black" onClick={sendMessage}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
