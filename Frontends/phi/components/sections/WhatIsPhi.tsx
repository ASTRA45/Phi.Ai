"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function WhatIsPhi() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="relative py-40 bg-black text-white overflow-hidden">
      
      {/* FLOATING GRADIENT Φ IN BACKGROUND */}
      <motion.div
        initial={{ opacity: 0, scale: 1.2, y: 40 }}
        animate={isInView ? { opacity: 0.15, scale: 1, y: 0 } : {}}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.div
          animate={{ y: [0, -25, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="text-[22rem] font-black select-none bg-clip-text text-transparent 
                     bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500"
        >
          Φ
        </motion.div>
      </motion.div>

      {/* CONTENT */}
      <div ref={ref} className="relative max-w-4xl mx-auto px-6 text-center">

        {/* TITLE */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-5xl font-bold mb-8"
        >
          What is Phi.ai?
        </motion.h2>

        {/* PARAGRAPH WITH GRADIENT HIGHLIGHTING */}
        <AnimatedGradientParagraph>
          Phi.ai is the trust, memory, and reproducibility layer that transforms 
          conventional LLM agents into deterministic, auditable, and verifiable 
          autonomous systems. Built on SpoonOS and Neo blockchain, it enables agents 
          to behave consistently, maintain long-term memory, and provide on-chain 
          verifiable predictions.
        </AnimatedGradientParagraph>

      </div>
    </section>
  );
}


/* ─────────────────────────────────────────────── */
/* — WORD-BY-WORD WITH KEYWORD GRADIENT HIGHLIGHTS — */
/* ─────────────────────────────────────────────── */

function AnimatedGradientParagraph({ children }: { children: string }) {
  const keywords = [
    "Phi.ai",
    "trust",
    "memory",
    "deterministic",
    "verifiable",
    "on-chain",
    "SpoonOS",
    "Neo",
  ];

  const words = children.split(" ");

  function stylize(word: string) {
    const clean = word.replace(/[^a-zA-Z0-9.-]/g, ""); // strip punctuation
    if (keywords.includes(clean)) {
      return (
        <span className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-semibold">
          {word}
        </span>
      );
    }
    return word;
  }

  return (
    <p className="text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03, duration: 0.35 }}
          viewport={{ once: true, margin: "-20% 0px" }}
          className="inline-block mr-1"
        >
          {stylize(word)}
        </motion.span>
      ))}
    </p>
  );
}
