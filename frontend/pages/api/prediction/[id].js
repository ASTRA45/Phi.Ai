// frontend/pages/api/prediction/[id].js

import { getPrediction } from "../../../../frontend/lib/neoRpc";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "predictionId required in URL" });
  }

  try {
    const prediction = await getPrediction(id);

    if (!prediction) {
      return res.status(404).json({ error: "Prediction not found" });
    }

    return res.status(200).json({ ok: true, prediction });
  } catch (err) {
    console.error("Error in /api/prediction/[id]:", err);
    return res.status(500).json({ error: err.message || "Internal error" });
  }
}
