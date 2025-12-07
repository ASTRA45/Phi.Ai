"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { Architecture } from "@/components/sections/Architecture";
import { UseCases } from "@/components/sections/UseCases";
import { CTA } from "@/components/sections/CTA";

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

      {/* Pass handleStart to Hero + CTA */}
      <Hero onStart={handleStart} />
      <About />
      <Features />
      <Architecture />
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
