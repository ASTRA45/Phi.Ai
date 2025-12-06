"use client";

import { motion } from "framer-motion";

export function About() {
  return (
    <motion.section
      className="py-32 px-6 max-w-5xl mx-auto text-center"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl font-bold mb-6">What is Phi.ai?</h2>
      <p className="text-white/70 text-lg leading-relaxed">
        Phi.ai is the trust, memory, and reproducibility layer that transforms
        conventional LLM agents into deterministic, auditable, and verifiable
        autonomous systems. Built on SpoonOS + Neo blockchain, it enables
        agents to behave consistently, maintain long-term memory, and provide
        on-chain verifiable predictions.
      </p>
    </motion.section>
  );
}
