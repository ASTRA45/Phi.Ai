"use client";

import { motion } from "framer-motion";

export function UseCases() {
  return (
    <motion.section
      className="py-32 px-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl font-bold mb-10 text-center">Use Cases</h2>

      <ul className="grid md:grid-cols-2 gap-8 text-white/80 text-lg">
        <li>🪙 Crypto trading agents</li>
        <li>⚖️ DeFi risk engines</li>
        <li>📊 On-chain analytics</li>
        <li>🧑‍⚖️ Compliance & audit AI</li>
        <li>🤖 Multi-agent systems</li>
        <li>📈 Backtest-ready deterministic predictions</li>
      </ul>
    </motion.section>
  );
}
