"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* Persona Type */
interface Persona {
  userId: string;
  riskTolerance: string;
  markets: string[];
  horizon: string;
  domainTags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  // Persona state (FIXED TYPE)
  const [persona, setPersona] = useState<Persona | null>(null);

  useEffect(() => {
    async function loadPersona() {
      try {
        const res = await fetch("http://localhost:8000/persona/demoUser");
        if (!res.ok) return;

        const data: Persona = await res.json();
        setPersona(data);
      } catch (e) {
        console.error("Failed to load persona", e);
      }
    }

    loadPersona();
  }, []);

  const brandGradient =
    "bg-gradient-to-b from-[#360167] via-[#7C085A] to-[#CF268A]";

  return (
    <aside
      className={cn(
        "relative h-screen transition-all duration-300 flex flex-col text-white",
        brandGradient,
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Button */}
      <button
        className="p-2 absolute top-3 right-3 bg-white/10 hover:bg-white/20 rounded-md transition"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Brand */}
      <div
        className={cn(
          "pt-8 pb-6 px-4 flex items-center gap-3 transition-all",
          collapsed ? "justify-center" : ""
        )}
      >
        <div className="text-3xl font-bold text-[#FFB4C9]">ϕ</div>

        {!collapsed && <div className="text-xl font-semibold">Phi.AI</div>}
      </div>

      {/* PERSONA BLOCK */}
      {!collapsed && persona && (
        <div className="px-4">
          <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 space-y-2">
            <h2 className="text-lg font-semibold mb-2">Your Persona</h2>

            <p className="text-sm">
              <span className="font-semibold">Risk:</span>{" "}
              {persona.riskTolerance}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Markets:</span>{" "}
              {persona.markets.join(", ")}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Horizon:</span>{" "}
              {persona.horizon}
            </p>

            <p className="text-sm">
              <span className="font-semibold">Domains:</span>{" "}
              {persona.domainTags.join(", ")}
            </p>
          </div>
        </div>
      )}

      {/* EMPTY FILLER */}
      <div className="flex-1" />

    </aside>
  );
}
