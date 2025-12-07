from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class Persona(BaseModel):
    userId: str
    # Pydantic v2 uses pattern (not regex)
    riskTolerance: str = Field(pattern="^(low|medium|high)$")
    markets: List[str]
    horizon: str = Field(pattern="^(24h|7d|30d)$")
    domainTags: List[str] = []
    createdAt: Optional[datetime] = None
    updatedAt: Optional[datetime] = None


class Prediction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    userId: str
    eventId: str
    probabilityUp: float
    confidence: float
    riskTier: str
    seed: float
    explanationBullets: List[str]
    agentVersion: str = "v0.1"
    txHash: Optional[str] = None
    neofsObjectId: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.utcnow)


class PredictionRequest(BaseModel):
    userId: str
    eventId: str
    seed: Optional[float] = None


class PersonaUpdateRequest(BaseModel):
    userId: str
    riskTolerance: str
    markets: List[str]
    horizon: str
    domainTags: List[str] = []
