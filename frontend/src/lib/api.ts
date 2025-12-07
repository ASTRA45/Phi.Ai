import type {
    Persona,
    PersonaUpdateRequest,
    Prediction,
    PredictionRequest,
  } from "../types/phi";
  
  const BASE_URL = process.env.NEXT_PUBLIC_PHI_API_URL || "http://localhost:8000";
  
  export async function fetchPersona(userId: string): Promise<Persona | null> {
    const res = await fetch(`${BASE_URL}/persona/${userId}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to fetch persona");
    return res.json();
  }
  
  export async function updatePersona(
    payload: PersonaUpdateRequest
  ): Promise<Persona> {
    const res = await fetch(`${BASE_URL}/persona/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to update persona");
    return res.json();
  }
  
  export async function createPrediction(
    payload: PredictionRequest
  ): Promise<Prediction> {
    const res = await fetch(`${BASE_URL}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Failed to create prediction");
    return res.json();
  }
  
  export async function fetchPredictionsByUser(
    userId: string
  ): Promise<Prediction[]> {
    const res = await fetch(`${BASE_URL}/predictions/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch predictions");
    return res.json();
  }
  