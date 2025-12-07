"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "./GradientBackground";
import { ParticleField } from "./ParticleField";

interface HeroProps {
  onStart: () => void;
}

export function Hero({ onStart }: HeroProps) {
  return (
    <section className="relative h-[100vh] flex flex-col items-center justify-center px-6 text-center overflow-hidden">

      {/* Background Layers */}
      <GradientBackground />
      <ParticleField />  {/* ← NEW interactive particle layer */}

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-2 mb-4 relative z-10"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold">
          Φ
        </div>
        <span className="text-lg font-medium text-white">Phi.ai</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-4 relative z-10 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        AI You Can Trust.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Deterministic. Verifiable. On-Chain. The trust layer for autonomous agents.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex gap-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        {/* Get Started button */}
        <button
          onClick={onStart}
          className="px-6 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition"
        >
          Get Started
        </button>

        {/* Learn More button */}
        <Button
          variant="outline"
          className="!border-white !text-white !bg-transparent hover:!bg-white/10 hover:!text-white px-8 py-6 text-lg rounded-full"
        >
          Learn More
        </Button>
      </motion.div>
    </section>
  );
}
