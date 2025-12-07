// app/api/tts/route.ts
import { NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

// 🧹 Clean text so ElevenLabs doesn’t crash
function sanitizeForTTS(text: string) {
  return text
    .replace(/[*_~`>#]/g, "")              // remove markdown
    .replace(/[•●▪︎▪]/g, "")               // remove bullets
    .replace(/[^\w\s.,:;%()!?/-]/g, "")    // remove emojis & odd unicode
    .replace(/\n+/g, " ")                  // collapse newlines
    .replace(/\s+/g, " ")                  // collapse spaces
    .trim();
}

export async function POST(req: Request) {
  console.log("🔊 /api/tts hit");

  try {
    const { text } = await req.json();
    console.log("📥 Raw TTS text:", text);

    const cleanedText = sanitizeForTTS(text);
    console.log("🧼 Cleaned TTS text:", cleanedText);

    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing ELEVENLABS_API_KEY" },
        { status: 500 }
      );
    }

    const client = new ElevenLabsClient({ apiKey });
    console.log("⚙️ ElevenLabs client created");

    // Generate audio
    const audioStream = await client.generate({
      voice: "Rachel",
      model_id: "eleven_flash_v2",
      text: cleanedText,
    });

    console.log("📡 Stream received from ElevenLabs");

    // Convert to Buffer (flash_v2 returns Node stream)
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
