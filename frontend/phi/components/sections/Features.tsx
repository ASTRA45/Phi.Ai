"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Persistent Memory",
    desc: "Long-term persona profiles stored in vector DB (Qdrant / pgvector).",
  },
  {
    title: "Deterministic LLM Calls",
    desc: "Seeded predictions produce identical outputs every time.",
  },
  {
    title: "On-Chain Verification",
    desc: "Predictions hashed + timestamped on Neo blockchain.",
  },
];

export function Features() {
  return (
    <section className="py-32 px-6 max-w-6xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-16">Core Pillars</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-white/5 border-white/10 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="text-2xl font-semibold mb-2">{f.title}</h3>
                <p className="text-white/70">{f.desc}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
