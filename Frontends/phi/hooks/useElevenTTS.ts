"use client";

import { useState } from "react";
import { ElevenLabsClient } from "elevenlabs";

export function useElevenTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async (text: string) => {
    setIsSpeaking(true);

    try {
      const client = new ElevenLabsClient({
        apiKey: process.env.ELEVENLABS_API_KEY!,
      });

      // Your SDK returns a Node.js Readable — not a browser ReadableStream
      const nodeReadable: NodeJS.ReadableStream =
        await client.textToSpeech.convert(
          "21m00Tcm4TlvDq8ikWAM",
          {
            text,
            model_id: "eleven_multilingual_v2",
          }
        );

      // Convert Node.js Readable → Blob
      const chunks: Buffer[] = [];

      for await (const chunk of nodeReadable) {
        chunks.push(chunk as Buffer);
      }

      const audioBlob = new Blob(chunks, { type: "audio/mpeg" });
      const audioURL = URL.createObjectURL(audioBlob);

      const audio = new Audio(audioURL);
      audio.play();

      audio.onended = () => setIsSpeaking(false);
    } catch (error) {
      console.error("ElevenLabs TTS error:", error);
      setIsSpeaking(false);
    }
  };

  return { speak, isSpeaking };
}
