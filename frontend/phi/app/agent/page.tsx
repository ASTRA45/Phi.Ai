"use client";

import { useState } from "react";
import AgentChat from "@/components/agent/AgentChat";
import VerificationBar from "@/components/agent/VerificationBar";

export default function AgentPage() {
  const [output, setOutput] = useState("");

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-20 px-6">
      <div className="max-w-3xl w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Phi Autonomous Agent Playground
        </h1>
        <p className="text-center text-gray-400 mb-10">
          Interact with a deterministic, verifiable AI agent.  
          Every response is reproducible and can be verified on-chain.
        </p>

        {/* Chat Component */}
        <AgentChat onOutputGenerated={setOutput} />

        {/* Verification Bar */}
        <VerificationBar output={output} />
      </div>
    </div>
  );
}
