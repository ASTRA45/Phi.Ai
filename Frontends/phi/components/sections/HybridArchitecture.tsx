"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Cpu, HardDrive, Database, Network } from "lucide-react";

export function HybridArchitecture() {
  const ref = useRef(null);

  // Scroll progress through entire section
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  //
  // TIMING WINDOWS FOR FUSION EFFECT
  //
  const spoonFuse   = useTransform(scrollYProgress, [0.00, 0.15, 0.25], [1, 0.6, 0]);
  const neoFuse     = useTransform(scrollYProgress, [0.20, 0.35, 0.45], [1, 0.6, 0]);
  const neofsFuse   = useTransform(scrollYProgress, [0.40, 0.55, 0.65], [1, 0.6, 0]);
  const vectorFuse  = useTransform(scrollYProgress, [0.60, 0.75, 0.90], [1, 0.6, 0]);

  // MOVEMENT TOWARD PHI CORE
  const leftX     = useTransform(scrollYProgress, [0.00, 0.25], ["-200px", "0px"]);
  const rightX    = useTransform(scrollYProgress, [0.20, 0.45], ["200px", "0px"]);
  const topY      = useTransform(scrollYProgress, [0.40, 0.65], ["-200px", "0px"]);
  const bottomY   = useTransform(scrollYProgress, [0.60, 0.90], ["200px", "0px"]);

  // SHRINKING ON APPROACH
  const scaleLeft    = useTransform(scrollYProgress, [0.00, 0.25], [1, 0.3]);
  const scaleRight   = useTransform(scrollYProgress, [0.20, 0.45], [1, 0.3]);
  const scaleTop     = useTransform(scrollYProgress, [0.40, 0.65], [1, 0.3]);
  const scaleBottom  = useTransform(scrollYProgress, [0.60, 0.90], [1, 0.3]);

  //
  // PHI GLOW → increases each time a component fuses
  //
  const phiGlow = useTransform(scrollYProgress, [0, 1], [0.2, 1]);

  const phiPulse = useTransform(scrollYProgress, 
    [0.22, 0.25, 0.47, 0.50, 0.72, 0.75, 0.92, 0.95],
    [1, 1.1, 1, 1.1, 1, 1.1, 1, 1.15]
  );

  return (
    <section ref={ref} className="relative py-48 bg-black text-white overflow-hidden">

      {/* BACKGROUND GLOW */}
      <motion.div
        style={{ opacity: phiGlow }}
        className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-600/10 to-indigo-500/10 blur-3xl"
      />

      <div className="relative max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-5xl font-bold mb-20">Hybrid Architecture</h2>

        {/* VISUAL ASSEMBLY */}
        <div className="relative h-[380px] flex items-center justify-center">

          {/* CENTRAL Φ */}
          <motion.div
            style={{ scale: phiPulse }}
            className="absolute text-[9rem] font-black 
                       bg-clip-text text-transparent
                       bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400
                       drop-shadow-[0_0_25px_rgba(255,0,200,0.3)]
            "
          >
            Φ
          </motion.div>

          {/* COMPONENTS */}
          
          {/* SPOONOS — left */}
          <ComponentBlock
            label="SpoonOS"
            icon={<Cpu size={28} />}
            x={leftX}
            scale={scaleLeft}
            opacity={spoonFuse}
          />

          {/* NEO BLOCKCHAIN — right */}
          <ComponentBlock
            label="Neo Blockchain"
            icon={<Network size={28} />}
            x={rightX}
            scale={scaleRight}
            opacity={neoFuse}
          />

          {/* NEOFS — top */}
          <ComponentBlock
            label="NeoFS Storage"
            icon={<HardDrive size={28} />}
            y={topY}
            scale={scaleTop}
            opacity={neofsFuse}
          />

          {/* VECTOR MEMORY — bottom */}
          <ComponentBlock
            label="Vector Memory"
            icon={<Database size={28} />}
            y={bottomY}
            scale={scaleBottom}
            opacity={vectorFuse}
          />

        </div>

        {/* PARAGRAPH — appears after fusion */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 text-lg md:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto"
        >
          Phi.ai combines off-chain agent intelligence with on-chain verifiability 
          using SpoonOS, Neo blockchain, NeoFS storage, and vector memory. 
          Together they form a reproducible and auditable AI pipeline for DeFi, 
          agents, and autonomous systems.
        </motion.p>

      </div>
    </section>
  );
}

/* COMPONENT BLOCK */
function ComponentBlock({ label, icon, x, y, scale, opacity }: any) {
  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="absolute px-6 py-4 rounded-2xl 
                 bg-gradient-to-br from-pink-600/20 to-purple-700/20 
                 border border-white/10 backdrop-blur-xl shadow-xl
                 flex items-center gap-3"
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </motion.div>
  );
}
