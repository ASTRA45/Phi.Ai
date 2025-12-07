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

  const agentModes = [
    { label: "Default Agent", icon: Bot },
    { label: "Reasoning Mode", icon: Brain },
    { label: "Creative Mode", icon: Sparkles },
    { label: "System Tools", icon: Settings },
  ];

  return (
    <aside
      className={cn(
        "relative border-r h-screen transition-all duration-300 flex flex-col",
        "bg-gradient-to-b from-purple-600 via-pink-500 to-pink-400 text-white",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse Button */}
      <button
        className="p-2 absolute top-3 right-3 bg-white/20 hover:bg-white/30 rounded-md"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* ⭐ PHI.AI HEADER ⭐ */}
      <div className="pt-8 pb-6 px-4 flex items-center gap-3">
        <div
          className={cn(
            "text-3xl font-bold tracking-tight select-none",
            collapsed ? "mx-auto" : ""
          )}
        >
          ϕ
        </div>

        {!collapsed && (
          <div className="text-xl font-semibold tracking-wide select-none">
            Phi.AI
          </div>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="p-4 space-y-4 overflow-y-auto">

        {/* AGENT MODES ACCORDION */}
        {!collapsed && (
          <Accordion type="single" collapsible>
            <AccordionItem value="agent-modes">

              {/* ⭐ NEW CLEAR, BUTTON-LIKE DROPDOWN TRIGGER ⭐ */}
              <AccordionTrigger
                className="
                  flex items-center justify-between w-full
                  px-4 py-3
                  bg-white/15 hover:bg-white/25
                  rounded-lg
                  font-semibold text-white
                  transition
                  border border-white/30
                  backdrop-blur-sm
                "
              >
                <span>Agent Modes</span>
              </AccordionTrigger>

              <AccordionContent className="mt-3">
                <div className="space-y-2">
                  {agentModes.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className="
                        w-full flex items-center gap-2 px-3 py-2
                        bg-white/10 hover:bg-white/20
                        rounded-md text-white
                        transition
                      "
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

        {/* Example Agents */}
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

      {/* Right fade shadow */}
      {!collapsed && (
        <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-r from-black/20 to-transparent" />
      )}
    </aside>
  );
}