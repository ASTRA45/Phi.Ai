export type RiskTolerance = "low" | "medium" | "high";
export type Horizon = "24h" | "7d" | "30d";
export type RiskTier = "low" | "medium" | "medium-high" | "high";

export interface Persona {
  userId: string;
  riskTolerance: RiskTolerance;
  markets: string[];
  horizon: Horizon;
  domainTags: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Prediction {
  id: string;
  userId: string;
  eventId: string;
  probabilityUp: number;
  confidence: number;
  riskTier: RiskTier;
  seed: number;
  explanationBullets: string[];
  agentVersion: string;
  txHash?: string;
  neofsObjectId?: string;
  createdAt: string;
}

export interface PredictionRequest {
  userId: string;
  eventId: string;
  seed?: number;
}

export interface PersonaUpdateRequest {
  userId: string;
  riskTolerance: RiskTolerance;
  markets: string[];
  horizon: Horizon;
  domainTags: string[];
}
