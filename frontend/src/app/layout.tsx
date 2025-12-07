// src/app/layout.tsx
import React from "react";
import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Phi.ai",
  description: "AI oracle & persona layer on Neo",
};

const navLinkClass =
  "px-3 py-1 rounded-md text-sm font-medium hover:bg-slate-800 transition";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50 min-h-screen">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400" />
              <span className="font-semibold text-lg tracking-tight">
                Phi.ai
              </span>
            </div>
            <nav className="flex gap-2">
              <Link href="/persona" className={navLinkClass}>
                Persona
              </Link>
              <Link href="/predictions" className={navLinkClass}>
                Predictions
              </Link>
              {/* Legacy Neo UI in /pages/prediction */}
              <Link href="/prediction" className={navLinkClass}>
                On-chain / Neo
              </Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
