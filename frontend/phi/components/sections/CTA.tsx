"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <motion.section
      className="py-40 text-center"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <h2 className="text-4xl font-bold mb-6">Ready to Build with Phi.ai?</h2>
      <Button className="px-10 py-6 text-xl bg-pink-600 rounded-full">
        Get Started
      </Button>
    </motion.section>
  );
}
