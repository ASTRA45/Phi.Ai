"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brain, Sparkles, Shield } from "lucide-react";

export function AgentParallax() {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const yBack = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const yMid = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section
      ref={ref}
      className="relative py-32 px-6 lg:px-20 bg-black text-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="space-y-8 lg:space-y-10 lg:sticky lg:top-32">
          <p className="text-sm font-semibold tracking-[0.2em] uppercase text-pink-400">
            Agentic Intelligence
          </p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Agents that think, remember, and cooperate like a system.
          </h2>

          <p className="text-base md:text-lg text-white/70 max-w-xl">
            Phi.ai gives you deterministic, verifiable agents that can plan,
            call tools, and coordinate with each other without becoming a
            black box. Every decision is explainable.
          </p>

          <div className="space-y-4 text-sm md:text-base">
            <FeatureItem
              icon={<Brain size={14} />}
              title="Reasoning cores"
              description="Route complex tasks through reasoning-first agents tuned for reliability and traceability."
              color="bg-pink-500/20"
            />

            <FeatureItem
              icon={<Sparkles size={14} />}
              title="Composable behaviors"
              description="Chain agents into reusable pipelines — research, analysis, execution."
              color="bg-purple-500/20"
            />

            <FeatureItem
              icon={<Shield size={14} />}
              title="On-chain accountability"
              description="Anchor decisions on-chain with verifiable logs, policies, and guardrails."
              color="bg-indigo-500/20"
            />
          </div>
        </div>

        {/* RIGHT FLOATING CARDS */}
        <div className="relative h-[420px] md:h-[500px]">
          {/* Glow pad */}
          <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-pink-500/10 blur-3xl" />

          {/* BACK CARD */}
          <motion.div style={{ y: yBack }} className="absolute left-[5%] top-[20%]">
            <FloatingCard
              title="Reasoning Agent"
              subtitle="Breaks goals into verifiable steps."
              colorFrom="#360167"
              colorTo="#7C085A"
              icon={<Brain size={24} />}
            />
          </motion.div>

          {/* MID CARD */}
          <motion.div style={{ y: yMid }} className="absolute right-[5%] top-[30%]">
            <FloatingCard
              title="Tool-Calling Agent"
              subtitle="Executes reliably using tools & APIs."
              colorFrom="#6B0772"
              colorTo="#AF1281"
              icon={<Sparkles size={24} />}
            />
          </motion.div>

          {/* FRONT CARD */}
          <motion.div
            style={{ y: yFront }}
            className="absolute left-1/2 top-[45%] -translate-x-1/2"
          >
            <FloatingCard
              title="Multi-Agent System"
              subtitle="Orchestrates teams of agents as one."
              colorFrom="#CF268A"
              colorTo="#FFB4C9"
              icon={<UsersIcon />}
              large
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureItem({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`mt-1 h-6 w-6 rounded-full ${color} flex items-center justify-center`}>
        {icon}
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-white/60">{description}</p>
      </div>
    </div>
  );
}

function FloatingCard({
  title,
  subtitle,
  colorFrom,
  colorTo,
  icon,
  large,
}: {
  title: string;
  subtitle: string;
  colorFrom: string;
  colorTo: string;
  icon: React.ReactNode;
  large?: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.04, y: -4 }}
      className={`
        rounded-3xl shadow-2xl border border-white/10
        backdrop-blur-xl text-left text-white
        ${large ? "w-80 p-5" : "w-64 p-4"}
      `}
      style={{
        background: `linear-gradient(135deg, ${colorFrom}, ${colorTo})`,
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-9 w-9 rounded-2xl bg-black/15 flex items-center justify-center">
          {icon}
        </div>
        <p className="font-semibold text-base md:text-lg">{title}</p>
      </div>
      <p className="text-xs md:text-sm text-white/80">{subtitle}</p>
    </motion.div>
  );
}

function UsersIcon() {
  return (
    <div className="flex -space-x-1">
      <div className="h-3 w-3 rounded-full bg-white/90" />
      <div className="h-3 w-3 rounded-full bg-white/70" />
      <div className="h-3 w-3 rounded-full bg-white/50" />
    </div>
  );
}
