"use client";

import { motion } from "framer-motion";

interface CTAProps {
  onStart: () => void;
}

export function CTA({ onStart }: CTAProps) {
  return (
    <motion.section
      className="py-40 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl font-bold mb-6">Ready to Build with Phi.ai?</h2>

      <button
        onClick={onStart}
        className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
      >
        Get Started
      </button>
    </motion.section>
  );
}
