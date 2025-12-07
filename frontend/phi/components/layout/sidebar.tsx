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

      {/* Sidebar Content */}
      <div className="p-4 mt-10 space-y-4">
        {!collapsed && (
          <Accordion type="single" collapsible>
            <AccordionItem value="agent-modes">
              <AccordionTrigger className="text-white font-semibold">
                Agent Modes
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 mt-2">
                  {agentModes.map(({ label, icon: Icon }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-2 px-3 py-2 
                                 bg-white/10 hover:bg-white/20 
                                 transition rounded-md text-white"
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

        {/* Example Agent List */}
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

      {/* Fade border */}
      {!collapsed && (
        <div className="absolute top-0 right-0 w-3 h-full bg-gradient-to-r from-black/20 to-transparent" />
      )}
    </aside>
  );
}
