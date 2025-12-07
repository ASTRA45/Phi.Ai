"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Lucide Icons
import { ShieldCheck, Gauge, AlertTriangle } from "lucide-react";

const riskOptions = [
  {
    id: "low",
    title: "Low Risk",
    icon: <ShieldCheck size={48} className="text-[#45FFC2]" />, // teal-green
  },
  {
    id: "medium",
    title: "Medium Risk",
    icon: (
      <Gauge
        size={48}
        className="text-[#CF268A]" // your main pink
      />
    ),
  },
  {
    id: "high",
    title: "High Risk",
    icon: (
      <AlertTriangle
        size={48}
        className="text-[#FF3B7B]" // pinkish red
      />
    ),
  },
];

export default function PersonaRisk() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0E0015] text-white px-6">
      <h1 className="text-4xl font-bold mb-10">What’s Your Risk Level?</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {riskOptions.map((opt, index) => (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.05 }}
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(`/persona/markets?risk=${opt.id}`)}
            className="p-8 rounded-2xl border border-white/10 bg-white/5 
                       hover:border-[#AF1281] hover:bg-white/10 transition"
          >
            <div className="mb-3 flex justify-center">{opt.icon}</div>

            <div className="text-xl font-semibold text-center">{opt.title}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
