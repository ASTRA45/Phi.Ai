import { NextResponse } from "next/server";
import OpenAI from "openai/index.js";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message missing" }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing OPENAI_API_KEY" },
        { status: 500 }
      );
    }

    const client = new OpenAI({ apiKey });

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini", // fast + cheap, change to "gpt-4.1" if preferred
      messages: [
        {
          role: "system",
          content:
            "You are Phi.AI Assistant — concise, intelligent, and helpful.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 300,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "I'm not sure how to respond.";

    return NextResponse.json({ reply });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "OpenAI request failed",
        details: err?.message || "unknown error",
      },
      { status: 500 }
    );
  }
}
