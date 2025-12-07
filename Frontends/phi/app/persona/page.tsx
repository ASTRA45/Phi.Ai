"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const riskOptions = [
  {
    id: "low",
    title: "Low Risk",
    emoji: "🟢",
    desc: "Safe, steady, conservative forecasting.",
  },
  {
    id: "medium",
    title: "Medium Risk",
    emoji: "🟡",
    desc: "Balanced, reasonable predictions.",
  },
  {
    id: "high",
    title: "High Risk",
    emoji: "🔴",
    desc: "Aggressive, high-volatility forecasting.",
  },
];

export default function PersonaStepOne() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);

  const handleNext = () => {
    if (!selected) return;
    router.push(`/persona/markets?risk=${selected}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0E0015] text-white relative">
      {/* AURORA BACKGROUND */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(175,18,129,0.25),transparent)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(54,1,103,0.25),transparent)] pointer-events-none" />

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-10"
      >
        Choose Your Risk Profile
      </motion.h1>

      {/* GRID OF CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {riskOptions.map((opt, index) => (
          <motion.button
            key={opt.id}
            onClick={() => setSelected(opt.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: index * 0.1 },
            }}
            whileHover={{ scale: 1.05 }}
            className={`p-8 rounded-2xl text-left border transition relative
              ${
                selected === opt.id
                  ? "border-[#CF268A] bg-[#360167]/40 shadow-[0_0_25px_#CF268A80]"
                  : "border-white/10 bg-white/5 hover:border-[#AF1281]"
              }
            `}
          >
            <div className="text-5xl mb-4">{opt.emoji}</div>
            <div className="text-2xl font-semibold mb-2">{opt.title}</div>
            <p className="text-white/70">{opt.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* NEXT BUTTON */}
      <motion.button
        onClick={handleNext}
        disabled={!selected}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-12 px-10 py-4 rounded-full bg-[#AF1281] hover:bg-[#CF268A] disabled:bg-gray-700 disabled:cursor-not-allowed transition text-lg font-semibold"
      >
        Continue →
      </motion.button>
    </div>
  );
}
