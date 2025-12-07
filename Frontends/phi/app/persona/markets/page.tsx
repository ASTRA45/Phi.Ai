"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

// Icons (Lucide)
import {
  Coins,
  LineChart,
  Trophy,
  Landmark,
  Globe,
} from "lucide-react";

const MARKET_OPTIONS = [
  {
    id: "crypto",
    label: "Crypto",
    icon: <Coins size={40} className="text-[#CF268A]" />,
  },
  {
    id: "stocks",
    label: "Stocks",
    icon: <LineChart size={40} className="text-[#45FFC2]" />,
  },
  {
    id: "sports",
    label: "Sports",
    icon: <Trophy size={40} className="text-[#FF3B7B]" />,
  },
  {
    id: "politics",
    label: "Politics",
    icon: <Landmark size={40} className="text-[#AF1281]" />,
  },
  {
    id: "economics",
    label: "Economics",
    icon: <Globe size={40} className="text-[#8A56FF]" />,
  },
];

export default function PersonaMarkets() {
  const router = useRouter();
  const params = useSearchParams();

  const risk = params.get("risk");
  const [selected, setSelected] = useState<string[]>([]);

  const toggleMarket = (m: string) => {
    setSelected((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const goNext = () => {
    if (selected.length === 0) return;

    const marketsParam = selected.join(",");
    router.push(`/persona/horizon?risk=${risk}&markets=${marketsParam}`);
  };

  const goBack = () => {
    router.push("/persona/risk");
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
        Which Markets Do You Care About?
      </h1>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
        {MARKET_OPTIONS.map((opt, index) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            onClick={() => toggleMarket(opt.id)}
            className={`
              p-8 rounded-2xl border transition flex flex-col items-center text-center
              ${
                selected.includes(opt.id)
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
        disabled={selected.length === 0}
        className="mt-12 px-10 py-4 rounded-full text-lg bg-gradient-to-r 
                   from-pink-500 to-purple-600 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →
      </button>
    </div>
  );
}
