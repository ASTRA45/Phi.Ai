# Phi.Ai

Phi.ai is a hybrid off-chain / on-chain AI trust layer for AI agents and Web3 applications.
It gives AI agents:

Persistent persona memory per user

Deterministic predictions using seeds

Verifiable, on-chain decision logs on Neo

Optional NeoFS storage for reasoning and context

x402 pay-per-prediction support for monetization

Built with SpoonOS, Next.js, FastAPI, Neo N3, and NeoFS.

 # Features
AI Agent Layer (SpoonOS)

Multi-agent pipeline:

DataAgent → market data

RAGAgent → persona memory retrieval

ModelAgent → LLM prediction

RiskAgent → probability + confidence + risk tier

PublisherAgent → on-chain + NeoFS logging

Deterministic predictions via seeds

Rich explanations & traceable decision metadata

# On-Chain Trust Layer (Neo)

Smart Contract: PredictionRegistry

Stores:

Event ID

Hash(profile + input + seed + output)

Optional NeoFS object ID

Agent version

Allows dApps and wallets to verify AI decisions

# Storage Layer (NeoFS)

Stores:

Reasoning logs

Persona profiles

Context embeddings

Off-chain, verifiable, decentralized storage

# Monetization (x402)

Supports:

Pay-per-prediction

Pay-per-agent call

Fully compatible with SpoonOS x402 gateway

# Architecture Overview
Frontend (Next.js) → Backend API (FastAPI)
                         │
                         ▼
                SpoonOS Agent Pipeline
      Data → Context/RAG → Model → Risk → Publisher
                         │
                         ├── Neo Smart Contract (PredictionRegistry)
                         └── NeoFS (reasoning logs / persona docs)

# Tech Stack
Frontend

Next.js / React

TailwindCSS + shadcn/ui

Recharts

Backend

Python FastAPI

SpoonOS multi-agent system

Qdrant or pgvector for RAG

JSON-based data storage (dev)

On-Chain / Storage

Neo N3 smart contract (C# / Python)

NeoFS for reasoning logs

Optional: NeoID for identity

Optional: Trustless x402 Payments

# 📂 Project Structure
phi-ai/
├─ phi-frontend/          # Next.js app
│  ├─ app/
│  ├─ components/
│  └─ public/
│
├─ phi-backend/
│  ├─ app/
│  │  ├─ main.py          # FastAPI entry
│  │  ├─ models.py        # Pydantic models
│  │  ├─ agents/
│  │  │   └─ prediction_agent.py  # SpoonReactAI
│  ├─ data/
│  │  ├─ personas.json
│  │  ├─ predictions.json
│  └─ .env
│
├─ contracts/
│  └─ PredictionRegistry.cs   # Neo smart contract
│
└─ README.md

# Backend Setup
1. Create backend venv
cd phi-backend
uv venv .venv
source .venv/bin/activate

2. Install dependencies
uv pip install fastapi uvicorn spoon-ai-sdk spoon-toolkits python-dotenv

3. Create an .env file
OPENAI_API_KEY=sk-...
NEO_RPC_URL=https://testnet1.neo.coz.io:443
NEO_WIF=your-neo-wif

# Base Sepolia test wallet for x402
PRIVATE_KEY=0x<evm-key>
RPC_URL=https://sepolia.base.org
CHAIN_ID=84532

# x402 config
X402_AGENT_PRIVATE_KEY=0x<evm-key>
X402_RECEIVER_ADDRESS=0x<address>
X402_FACILITATOR_URL=https://x402.org/facilitator
X402_DEFAULT_ASSET=0xa063B8d5ada3bE64A24Df594F96aB75F0fb78160
X402_DEFAULT_NETWORK=base-sepolia
X402_DEFAULT_AMOUNT_USDC=0.10

4. Run backend
uvicorn app.main:app --reload --port 8000


API now serves:

POST /persona/update

GET /persona/{userId}

POST /predict → SpoonOS agent

GET /predictions/{userId}

GET /predictions/by-event/{eventId}

# AI Agent (SpoonOS)

The backend agent lives in:

phi-backend/app/agents/prediction_agent.py

It uses:

A custom MarketDataTool

LLM via ChatBot

SpoonReactAI for tool-calling & reasoning

Deterministic seeds

JSON-only enforced responses

Core call:

agent_result = await run_prediction_with_spoon(
    persona=persona,
    event_id=body.eventId,
    seed=body.seed,
)

# x402 Integration (Optional)

Enable pay-per-prediction.

1. Start the x402 paywall gateway:
uv run python -m spoon_ai.payments.app

2. Call it from frontend:
POST /x402/invoke/phi_oracle
Headers:
  X-PAYMENT: <signed payment header>

Body:
{
  "prompt": "your spoon agent prompt..."
}


The response includes:

Prediction

X-PAYMENT-RESPONSE receipt

# Smart Contract (PredictionRegistry)

The Neo smart contract logs:

userId / agentId

eventId

probability / confidence

riskTier

hashed decision

NeoFS object ID

timestamp

# Contract path:

contracts/PredictionRegistry.cs

NeoFS Reasoning Storage

The Publisher step (backend) uploads:

raw reasoning chain

persona context snapshot

agent trace

# Your FastAPI can return a link:

GET /neofs/{objectId}

Developer Quick Start
Persona Creation
curl -X POST http://localhost:8000/persona/update \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "alice",
    "riskTolerance": "medium",
    "markets": ["BTC","ETH"],
    "horizon": "24h",
    "domainTags": ["crypto"]
  }'

Request Prediction
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "alice",
    "eventId": "BTC_24h"
  }'

# Frontend Setup

Inside phi-frontend:

npm install
npm run dev


Frontend provides:

Persona tab

Predictions tab

Prediction history

Developer API view

On-chain explorer links

# Roadmap
Phase 1 — Core Functionality

✔ SpoonOS multi-agent

✔ persona memory

✔ deterministic seeds

✔ NeoFS upload (stub)

✔ Prediction card + history UI

Phase 2 — On-Chain Trust

⬜ Deploy PredictionRegistry contract

⬜ Hash decisions & store on-chain

⬜ Store reasoning in NeoFS

Phase 3 — Monetization

⬜ Enable x402 paywall

⬜ Pay-per-prediction

⬜ DeFi oracle access

# Contributing

PRs welcome!
If you add agents, tools, or storage modules, please document them in the /docs folder.

# License

MIT License.
