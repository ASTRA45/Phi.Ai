"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { WhatIsPhi } from "@/components/sections/WhatIsPhi";
import { HybridArchitecture } from "@/components/sections/HybridArchitecture";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { UseCases } from "@/components/sections/UseCases";
import { CTA } from "@/components/sections/CTA";

// ⭐ NEW IMPORTS — Interactive Scroll Sections
import { AgentParallax } from "@/components/sections/AgentParallax";
import { CorePillars } from "@/components/sections/CorePillars";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Called by buttons in Hero and CTA
  const handleStart = () => {
    setLoading(true);

    setTimeout(() => {
      router.push("/get-started");
    }, 1500);
  };

  return (
    <main className="relative">

      {/* HERO SECTION */}
      <Hero/>
      <AgentParallax />

      {/* ⭐ NEW APPLE WATCH ULTRA–STYLE PINNED SCROLL SECTION */}
      <CorePillars />
      <Features />
      {/* EXISTING SITE SECTIONS */}
      <WhatIsPhi /> 
      <HybridArchitecture />
      <UseCases />
      <CTA onStart={handleStart} />

      {/* FULLSCREEN LOADING ANIMATION */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50 animate-fadeIn">
          <div className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </main>
  );
}
