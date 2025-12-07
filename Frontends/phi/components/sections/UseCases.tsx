"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Scale,
  BarChart3,
  Brain,
  Users,
  LineChart,
} from "lucide-react";

// Brand palette
const palette = [
  "#360167",
  "#6B0772",
  "#7C085A",
  "#AF1281",
  "#CF268A",
  "#E65C9C",
  "#FB8CAB",
  "#FFB4C9",
];

const useCases = [
  { icon: TrendingUp, title: "Crypto Trading Agents" },
  { icon: Scale, title: "DeFi Risk Engines" },
  { icon: BarChart3, title: "On-chain Analytics" },
  { icon: Brain, title: "Compliance & Audit AI" },
  { icon: Users, title: "Multi-Agent Systems" },
  { icon: LineChart, title: "Deterministic Predictions" },
];

// FIXED + WRAPPED CARD
function CaseCard({ icon: Icon, title, color }: any) {
  return (
    <div
      className="
        flex flex-col items-center justify-center 
        rounded-2xl shadow-lg text-white select-none
      "
      style={{
        width: "200px",
        height: "140px",
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      }}
    >
      <Icon size={32} />

      {/* FIXED TEXT WIDTH + WRAPPING */}
      <p
        className="
          text-center font-semibold mt-2 text-[15px] leading-tight
          break-words whitespace-normal w-[150px]
        "
      >
        {title}
      </p>
    </div>
  );
}

export function UseCases() {
  const doubled = [...useCases, ...useCases];

  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <h2 className="text-4xl font-bold text-center mb-14">Use Cases</h2>

      {/* TOP ROW */}
      <div className="relative w-full overflow-hidden mb-10">
        <motion.div
          className="whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 18,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {doubled.map((item, i) => (
            <span key={`top-${i}`} className="inline-block mx-4 align-middle">
              <CaseCard
                {...item}
                color={palette[i % palette.length]}
              />
            </span>
          ))}
        </motion.div>
      </div>

      {/* BOTTOM ROW */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="whitespace-nowrap"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: 22,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {doubled.map((item, i) => (
            <span key={`bottom-${i}`} className="inline-block mx-4 align-middle">
              <CaseCard
                {...item}
                color={palette[(i + 3) % palette.length]} // slight color offset
              />
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
