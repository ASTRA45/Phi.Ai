"use client";

import { motion } from "framer-motion";

export function Architecture() {
  return (
    <motion.section
      className="py-32 px-6 max-w-5xl mx-auto text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl font-bold mb-6">Hybrid Architecture</h2>
      <p className="text-white/70 text-lg max-w-3xl mx-auto">
        Phi.ai combines off-chain agent intelligence with on-chain
        verifiability using SpoonOS, Neo blockchain, NeoFS storage, and vector
        memory. This creates a reproducible and auditable AI pipeline for
        DeFi, agents, and autonomous systems.
      </p>
    </motion.section>
  );
}
