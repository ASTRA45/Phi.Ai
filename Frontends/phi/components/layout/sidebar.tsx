"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import {
  Bot,
  Brain,
  Sparkles,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

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

        {!collapsed && (
          <div className="text-xl font-semibold">Phi.AI</div>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="p-4 space-y-4 overflow-y-auto">

        {/* Agent Modes */}
        {!collapsed && (
          <Accordion type="single" collapsible>
            <AccordionItem value="agent-modes">
              <AccordionTrigger className="text-white bg-white/10 px-3 py-2 rounded-md">
                Agent Modes
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-3">
                  {[
                    { label: "Default Agent", icon: Bot },
                    { label: "Reasoning Mode", icon: Brain },
                    { label: "Creative Mode", icon: Sparkles },
                    { label: "System Tools", icon: Settings },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-2 px-3 py-2 
                                 bg-white/10 hover:bg-white/20 rounded-md text-white"
                    >
                      <Icon size={16} />
                      {label}
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}

        {/* Agents */}
        <div className="space-y-2">
          {["Agent 1", "Agent 2", "Agent 3"].map((item) => (
            <button
              key={item}
              className="w-full bg-white/10 hover:bg-white/20 text-left 
                         px-3 py-2 rounded-md text-white"
            >
              {!collapsed && item}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
