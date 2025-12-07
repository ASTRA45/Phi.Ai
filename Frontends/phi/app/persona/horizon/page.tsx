"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

// Icons for horizons
import { Clock, Calendar, Hourglass, Timer } from "lucide-react";

const HORIZON_OPTIONS = [
  { id: "1d", label: "1 Day", icon: <Clock size={40} className="text-[#CF268A]" /> },
  { id: "7d", label: "7 Days", icon: <Calendar size={40} className="text-[#45FFC2]" /> },
  { id: "30d", label: "30 Days", icon: <Hourglass size={40} className="text-[#FF3B7B]" /> },
  { id: "90d", label: "90 Days", icon: <Timer size={40} className="text-[#8A56FF]" /> },
];

export default function PersonaHorizon() {
  const router = useRouter();
  const params = useSearchParams();

  const risk = params.get("risk");
  const markets = params.get("markets");
  const [selected, setSelected] = useState<string | null>(null);

  const goNext = () => {
    if (!selected) return;
    router.push(`/persona/domains?risk=${risk}&markets=${markets}&horizon=${selected}`);
  };

  const goBack = () => {
    router.push(`/persona/markets?risk=${risk}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E0015] text-white px-6 py-20">

      {/* BACK BUTTON */}
      <button
        onClick={goBack}
        className="absolute top-8 left-8 px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
      >
        ← Back
      </button>

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-10 text-center">
        What’s Your Prediction Horizon?
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
        {HORIZON_OPTIONS.map((opt, index) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => setSelected(opt.id)}
            className={`
              p-8 rounded-2xl border flex flex-col items-center text-center transition
              ${
                selected === opt.id
                  ? "border-[#CF268A] bg-[#CF268A]/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }
            `}
          >
            <div className="mb-3">{opt.icon}</div>
            <div className="text-xl font-semibold">{opt.label}</div>
          </motion.button>
        ))}
      </div>

      {/* CONTINUE BUTTON */}
      <button
        onClick={goNext}
        disabled={!selected}
        className="mt-12 px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-lg disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  );
}
