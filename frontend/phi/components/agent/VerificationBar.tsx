"use client";

import Link from "next/link";

export default function VerificationBar({ output }: { output: string }) {
  const hashOutput = output ? btoa(output) : ""; // placeholder hash

  return (
    <div className="bg-neutral-900/60 border border-white/10 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-2">Verify On-Chain</h2>

      {!output ? (
        <p className="text-gray-500">Generate an agent output first.</p>
      ) : (
        <>
          <p className="text-gray-300 text-sm mb-4">
            Output Hash: <span className="text-violet-400">{hashOutput}</span>
          </p>

          <Link href={{ pathname: "/verify", query: { hash: hashOutput } }}>
            <button className="bg-violet-600 px-5 py-2 rounded-xl hover:bg-violet-700">
              Verify On-Chain
            </button>
          </Link>
        </>
      )}
    </div>
  );
}
