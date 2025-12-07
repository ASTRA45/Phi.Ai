"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

import {
  Cpu,
  TrendingUp,
  Globe,
  Goal,
  DollarSign,
} from "lucide-react";

const OPTIONS = [
  {
    id: "crypto",
    label: "Crypto",
    icon: <DollarSign size={40} className="text-[#CF268A]" />,
  },
  {
    id: "stocks",
    label: "Stocks",
    icon: <TrendingUp size={40} className="text-[#45FFC2]" />,
  },
  {
    id: "macroeconomics",
    label: "Macroeconomics",
    icon: <Globe size={40} className="text-[#8A56FF]" />,
  },
  {
    id: "sports",
    label: "Sports",
    icon: <Goal size={40} className="text-[#FF3B7B]" />,
  },
  {
    id: "technology",
    label: "Technology",
    icon: <Cpu size={40} className="text-[#45FFC2]" />,
  },
];

export default function PersonaDomainsPage() {
  const params = useSearchParams();
  const router = useRouter();

  const risk = params.get("risk");
  const markets = params.get("markets");
  const horizon = params.get("horizon");

  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (tag: string) => {
    setSelected((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const goBack = () => {
    router.push(`/persona/horizon?risk=${risk}&markets=${markets}`);
  };

  const finish = async () => {
    await fetch("http://localhost:8000/persona/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demoUser",
        riskTolerance: risk,
        markets: markets?.split(",") || [],
        horizon,
        domainTags: selected,
      }),
    });

    router.push("/get-started");
  };

  return (
    <div className="min-h-screen bg-[#0E0015] text-white px-6 py-20 flex flex-col items-center">

      {/* HEADER */}
      <div className="w-full max-w-3xl flex items-center gap-4 mb-12">
        <button
          onClick={goBack}
          className="px-4 py-2 border border-white/20 rounded-lg hover:bg-white/10"
        >
          ← Back
        </button>
        <h1 className="text-3xl font-bold">Select Your Interest Domains</h1>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mb-12">
        {OPTIONS.map((opt, index) => (
          <motion.button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            whileHover={{ scale: 1.03 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className={`p-6 rounded-2xl border text-left backdrop-blur-md transition-all
              ${
                selected.includes(opt.id)
                  ? "border-purple-500/80 bg-purple-500/20 shadow-lg shadow-purple-500/20"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }
            `}
          >
            <div className="mb-3">{opt.icon}</div>
            <div className="text-xl font-semibold">{opt.label}</div>
          </motion.button>
        ))}
      </div>

      {/* FINISH BUTTON */}
      <button
        onClick={finish}
        disabled={selected.length === 0}
        className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full text-lg disabled:opacity-50"
      >
        Finish Persona Setup →
      </button>
    </div>
  );
}
