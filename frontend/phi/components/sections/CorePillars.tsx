"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Database, Repeat, ShieldCheck } from "lucide-react";

export function CorePillars() {
  const ref = useRef(null);

  // Scroll progress through the whole 400vh section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Divide scroll into 3 equal zones
  const pillar1Opacity = useTransform(scrollYProgress, [0.00, 0.15, 0.30], [1, 1, 0]);
  const pillar2Opacity = useTransform(scrollYProgress, [0.30, 0.45, 0.60], [0, 1, 0]);
  const pillar3Opacity = useTransform(scrollYProgress, [0.60, 0.80, 1.00], [0, 1, 1]);

  const pillar1Y = useTransform(scrollYProgress, [0.00, 0.30], [0, -40]);
  const pillar2Y = useTransform(scrollYProgress, [0.30, 0.60], [40, -40]);
  const pillar3Y = useTransform(scrollYProgress, [0.60, 1.00], [40, 0]);

  return (
    <section ref={ref} className="relative h-[400vh] bg-[#0a0a0c] text-white">
      
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen flex items-center justify-center px-10">
        <div className="max-w-6xl grid md:grid-cols-2 gap-20 items-center">

          {/* LEFT TEXT */}
          <div className="relative h-[300px]">

            {/* Pillar 1 */}
            <motion.div 
              className="absolute space-y-4"
              style={{ opacity: pillar1Opacity, y: pillar1Y }}
            >
              <Title icon={<Database size={36} />} text="Persistent Memory" />
              <Desc text="Long-term persona profiles stored in vector DB (Qdrant / pgvector)." />
            </motion.div>

            {/* Pillar 2 */}
            <motion.div 
              className="absolute space-y-4"
              style={{ opacity: pillar2Opacity, y: pillar2Y }}
            >
              <Title icon={<Repeat size={36} />} text="Deterministic LLM Calls" />
              <Desc text="Seeded predictions produce identical outputs every time." />
            </motion.div>

            {/* Pillar 3 */}
            <motion.div 
              className="absolute space-y-4"
              style={{ opacity: pillar3Opacity, y: pillar3Y }}
            >
              <Title icon={<ShieldCheck size={36} />} text="On-Chain Verification" />
              <Desc text="Predictions hashed & timestamped on the Neo blockchain." />
            </motion.div>

          </div>

          {/* RIGHT VISUALS */}
          <div className="relative h-[400px] flex items-center justify-center">

            <Blob color="from-pink-600/20 to-purple-600/20" opacity={pillar1Opacity} />
            <Blob color="from-purple-600/20 to-indigo-600/20" opacity={pillar2Opacity} />
            <Blob color="from-indigo-600/20 to-green-600/20" opacity={pillar3Opacity} />

          </div>

        </div>
      </div>
    </section>
  );
}

function Blob({ opacity, color }: any) {
  return (
    <motion.div
      style={{ opacity }}
      className={`
        absolute w-[320px] h-[320px]
        rounded-full blur-3xl
        bg-gradient-to-br ${color}
      `}
    />
  );
}

function Title({ icon, text }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="text-pink-300">{icon}</div>
      <h3 className="text-3xl md:text-4xl font-bold">{text}</h3>
    </div>
  );
}

function Desc({ text }: any) {
  return (
    <p className="text-lg text-white/70 max-w-md leading-relaxed">
      {text}
    </p>
  );
}
