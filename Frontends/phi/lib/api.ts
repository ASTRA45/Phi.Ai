// Frontends/phi/lib/api.ts
// This makes the file a module
export {};

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

//
// ------------------
// Type Definitions
// ------------------
// Match backend Pydantic models
//

export interface Persona {
  userId: string;
  riskTolerance: string;
  markets: string[];
  horizon: string;
  domainTags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface PersonaUpdateRequest {
  userId: string;
  riskTolerance: string;
  markets: string[];
  horizon: string;
  domainTags: string[];
}

export interface PredictionRequest {
  userId: string;
  eventId: string;
  seed?: number;
}

export interface Prediction {
  id: string;
  userId: string;
  eventId: string;
  probabilityUp: number;
  confidence: number;
  riskTier: string;
  seed: number;
  explanationBullets: string[];
  agentVersion: string;
  txHash: string | null;
  neofsObjectId: string | null;
  createdAt: string;
}

export interface X402DemoResponse {
  resource: string;
  amountUsdc: number;
  paymentHeader: string;
  rawOutput: string;
}

//
// ------------------
// API CLIENT
// ------------------
//

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  return res.json();
}

export const api = {
  //
  // PERSONAS
  //
  async updatePersona(body: PersonaUpdateRequest): Promise<Persona> {
    return request<Persona>("/persona/update", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getPersona(userId: string): Promise<Persona> {
    return request<Persona>(`/persona/${userId}`);
  },

  //
  // PREDICTIONS
  //
  async predict(body: PredictionRequest): Promise<Prediction> {
    return request<Prediction>("/predict", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getPredictionsForUser(userId: string): Promise<Prediction[]> {
    return request<Prediction[]>(`/predictions/${userId}`);
  },

  async getPredictionsByEvent(eventId: string): Promise<Prediction[]> {
    return request<Prediction[]>(`/predictions/by-event/${eventId}`);
  },

  //
  // X402 PAYMENT DEMO
  //
  async demoPayment(resource: string, amountUsdc = 0.1): Promise<X402DemoResponse> {
    return request<X402DemoResponse>("/x402/demo-payment", {
      method: "POST",
      body: JSON.stringify({ resource, amountUsdc }),
    });
  },
};
