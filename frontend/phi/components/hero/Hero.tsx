"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GradientBackground } from "./GradientBackground";

export function Hero() {
  return (
    <section className="relative h-[100vh] flex flex-col items-center justify-center px-6 text-center">
      <GradientBackground />

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="flex items-center gap-2 mb-4"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-xl font-bold">
        Φ
        </div>
        <span className="text-lg font-medium">Phi.ai</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="text-5xl md:text-6xl font-bold mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        AI You Can Trust.
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-xl md:text-2xl text-white/90 max-w-3xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
      >
        Deterministic. Verifiable. On-Chain. The trust layer for autonomous agents.
      </motion.p>

      {/* Buttons */}
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.7 }}
      >
        <Link href="/get-started">
  <Button className="px-8 py-6 text-lg rounded-full">
    Get Started
  </Button>
</Link>

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
