// frontend/pages/prediction/[id].js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function PredictionPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [prediction, setPrediction] = useState(null);
  const [raw, setRaw] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/prediction/${id}`);
        const data = await res.json();

        if (!data.ok) {
          throw new Error(data.error || "Failed to load prediction");
        }

        setPrediction(data.prediction);
        setRaw(data.raw);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (!id) return <p>Waiting for prediction id…</p>;
  if (loading) return <p>Loading prediction {id}…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!prediction) return <p>No prediction found for id: {id}</p>;

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Prediction: {id}</h1>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Decoded record</h2>
        <pre>{JSON.stringify(prediction, null, 2)}</pre>
      </section>

      <section style={{ marginTop: "1.5rem" }}>
        <h2>Raw stack item from RPC</h2>
        <pre>{JSON.stringify(raw, null, 2)}</pre>
      </section>
    </main>
  );
}
