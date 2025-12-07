// app/api/chat/route.ts
import { NextResponse } from "next/server";

const API_BASE = "http://localhost:8000";

export async function POST(req: Request) {
  console.log("🔥 CHAT HIT @", Date.now()); // <-- CORRECT SPOT

  try {
    const body = await req.json();
    const message = body.message || "Hello";

    // Call your existing backend prediction API
    const res = await fetch(`${API_BASE}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: "demo1",
        eventId: "generic-event",
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { reply: "Prediction backend returned an error." },
        { status: 500 }
      );
    }

    const data = await res.json();

    // Clean, no leading newline
    const reply = `📊 Prediction Result
Event: ${data.eventId}

Probability Up: ${data.probabilityUp.toFixed(2)}
Confidence: ${data.confidence.toFixed(2)}
Risk Tier: ${data.riskTier}

Reasons:
${data.explanationBullets.map((b: string) => "• " + b).join("\n")}`;

    return NextResponse.json({ reply });

  } catch (err: any) {
    console.error("CHAT ERROR", err);
    return NextResponse.json(
      { reply: "Chat service failed." },
      { status: 500 }
    );
  }
}
