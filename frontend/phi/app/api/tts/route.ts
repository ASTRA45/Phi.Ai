// app/api/tts/route.ts
import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

export async function POST(req: Request) {
  console.log("🔊 /api/tts hit");

  try {
    const { text } = await req.json();
    console.log("📥 TTS text:", text);

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing ELEVENLABS_API_KEY" },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({ apiKey });
    console.log("⚙️ ElevenLabs client created");

    // 🔥 NEW SDK CALL — THIS RETURNS A Node.js Readable STREAM
    const audioStream = await client.generate({
      voice: "Rachel",
      model_id: "eleven_flash_v2",
      text,
    });

    console.log("📡 Stream received from ElevenLabs");

    // --- FIX: Use Node.js stream reader ---
    const chunks: Uint8Array[] = [];

    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }

    const audioBuffer = Buffer.concat(chunks);

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.length.toString(),
      },
    });
  } catch (err: any) {
    console.error("🔥 FULL TTS ERROR:", err);
    return NextResponse.json(
      { error: "TTS failed", details: err.message },
      { status: 500 }
    );
  }
}
