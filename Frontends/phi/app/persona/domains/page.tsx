"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { Cpu, TrendingUp, Globe, Goal, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

const OPTIONS = [
  { id: "crypto", label: "Crypto", icon: DollarSign },
  { id: "stocks", label: "Stocks", icon: TrendingUp },
  { id: "macroeconomics", label: "Macroeconomics", icon: Globe },
  { id: "sports", label: "Sports", icon: Goal },
  { id: "technology", label: "Technology", icon: Cpu },
];

export default function PersonaDomains() {
  const params = useSearchParams();
  const router = useRouter();

  const risk = params.get("risk");
  const markets = params.get("markets")?.split(",") || [];
  const horizon = params.get("horizon");

  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const finish = async () => {
    await fetch("http://localhost:8000/persona/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demoUser",
        riskTolerance: risk,
        markets,
        horizon,
        domainTags: selected,
      }),
    });

    router.push("/get-started");
  };

  const goBack = () =>
    router.push(`/persona/horizon?risk=${risk}&markets=${markets.join(",")}`);

  return (
    <div className="min-h-screen bg-[#0E0015] text-white px-6 py-20 flex flex-col items-center">
      
      {/* BACK BUTTON */}
      <button
        onClick={goBack}
        className="self-start mb-6 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10">Select Your Interest Domains</h1>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl mb-12">
        {OPTIONS.map(({ id, label, icon: Icon }) => {
          const active = selected.includes(id);

          return (
            <motion.button
              key={id}
              onClick={() => toggle(id)}
              whileHover={{ scale: 1.03 }}
              className={`p-6 rounded-2xl border flex items-center gap-4 transition
                ${
                  active
                    ? "border-purple-500 bg-purple-600/20 shadow-lg shadow-purple-500/30"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }`}
            >
              <Icon
                size={32}
                className={active ? "text-purple-400" : "text-white/70"}
              />
              <span className="text-xl font-semibold">{label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* FINISH BUTTON */}
      <button
        onClick={finish}
        disabled={selected.length === 0}
        className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-lg disabled:opacity-40"
      >
        Finish Persona Setup →
      </button>
    </div>
  );
}

export {};
