# backend/app/agents/prediction_agent.py

import json
import os
import random
from typing import Any, Dict, Optional

from spoon_ai.agents import SpoonReactAI
from spoon_ai.chat import ChatBot
from spoon_ai.tools import ToolManager
from spoon_ai.tools.mcp_tool import MCPTool

from app.models import Persona


SYSTEM_PROMPT = """
You are Phi.ai — an AI trading and risk assessment agent for crypto markets on Neo.

You have access to this MCP tool (if configured):
- tavily-search (MCPTool): Web search via Tavily MCP server. Use it to fetch
  recent news/sentiment about the main asset (BTC, ETH, etc.) when helpful.

INPUTS YOU GET (in the user prompt):
- user persona (riskTolerance, markets, horizon, domainTags)
- eventId (e.g., "BTC_24h", "ETH_7d")
- seed (a float between 0 and 1)

YOUR JOB:
1. If helpful, call tavily-search to gather recent info about the main asset.
2. Estimate the probability that the asset will be HIGHER at the given horizon (0–1).
3. Provide a confidence score (0–1).
4. Assign a riskTier: "low" | "medium" | "medium-high" | "high".
5. Provide 2–4 short explanationBullets that:
   - mention persona fit (risk tolerance, horizon),
   - optionally mention any major news/sentiment you saw via tavily-search,
   - are concise and human-readable.

RESPONSE FORMAT (STRICT):
- You MUST respond with EXACTLY ONE JSON object.
- NO markdown, NO backticks, NO extra commentary.
- Only the JSON object, nothing before or after.

Shape:

{
  "probabilityUp": float,              // 0–1
  "confidence": float,                 // 0–1
  "riskTier": "low" | "medium" | "medium-high" | "high",
  "explanationBullets": [string, ...]  // 2–4 items
}
""".strip()


def build_tools() -> ToolManager:
    """
    Build the ToolManager with MCP tools if env is configured.

    Hackathon requirement: adopt MCP (Model Context Protocol).
    Here we add a Tavily-based web search tool via MCP if TAVILY_API_KEY is set.
    """
    tools = []

    tavily_key = os.getenv("TAVILY_API_KEY")
    if tavily_key:
        tavily_tool = MCPTool(
            name="tavily-search",
            description="Web search via Tavily MCP server",
            mcp_config={
                "command": "npx",
                "args": ["--yes", "tavily-mcp"],
                "env": {"TAVILY_API_KEY": tavily_key},
            },
        )
        tools.append(tavily_tool)
        print("[Phi.ai] MCP tavily-search tool enabled.")
    else:
        print("[Phi.ai] TAVILY_API_KEY not set, running WITHOUT MCP web search tool.")

    return ToolManager(tools)


# ---------------------------
# LLM configuration (SpoonOS)
# ---------------------------

llm = ChatBot(
    llm_provider="openai",
    model_name="gpt-4o-mini",
    enable_short_term_memory=False,
)

agent = SpoonReactAI(
    llm=llm,
    system_prompt=SYSTEM_PROMPT,
    tools=build_tools(),
    max_steps=4,
)


def _fallback_stub(seed: float) -> Dict[str, Any]:
    """
    If the agent output is not valid JSON or LLM/tool fails,
    we fall back to a deterministic stubbed prediction so the API
    still returns something usable (this is also basic error handling).
    """
    random.seed(seed)
    probability_up = round(random.uniform(0.45, 0.75), 2)
    confidence = round(random.uniform(0.6, 0.9), 2)

    return {
        "probabilityUp": probability_up,
        "confidence": confidence,
        "riskTier": "medium",
        "explanationBullets": [
            "Using fallback stub because agent output was not valid JSON or tool failed.",
            f"Seed used: {seed}",
        ],
    }


async def run_prediction_with_spoon(
    persona: Persona,
    event_id: str,
    seed: Optional[float] = None,
) -> Dict[str, Any]:
    """
    SpoonOS prediction entrypoint used by FastAPI:
    persona + event_id (+ MCP tools + LLM) -> normalized JSON-like dict.
    """

    # Deterministic seed for reproducible behavior
    if seed is None:
        seed = random.random()
    random.seed(seed)

    # 🔧 CRITICAL FIX: use model_dump(mode="json") so datetimes become strings
    persona_json = persona.model_dump(mode="json")

    user_payload = {
        "persona": persona_json,
        "eventId": event_id,
        "seed": seed,
    }

    prompt = (
        "Here is the prediction request as JSON:\n"
        + json.dumps(user_payload)
        + "\n\n"
        "Remember: respond with ONLY the JSON object described in the system prompt, "
        "no markdown, no backticks, no extra commentary."
    )

    try:
        response = await agent.run(prompt)
    except Exception as e:
        # If LLM or tools crash, log + fallback
        print("Error during agent run:", e)
        fallback = _fallback_stub(seed)
        fallback["seed"] = seed
        return fallback

    # Try to extract and parse strict JSON from the response
    text = str(response).strip()
    try:
        # Many models sometimes add small noise; try to locate JSON substring
        first_brace = text.find("{")
        last_brace = text.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            json_str = text[first_brace : last_brace + 1]
        else:
            json_str = text

        parsed = json.loads(json_str)
    except Exception as e:
        print("JSON parse error, falling back:", e)
        fallback = _fallback_stub(seed)
        fallback["seed"] = seed
        return fallback

    # Merge parsed values with fallback defaults where needed
    base = _fallback_stub(seed)
    result = {
        "probabilityUp": float(parsed.get("probabilityUp", base["probabilityUp"])),
        "confidence": float(parsed.get("confidence", base["confidence"])),
        "riskTier": parsed.get("riskTier", base["riskTier"]),
        "explanationBullets": parsed.get(
            "explanationBullets", base["explanationBullets"]
        ),
        "seed": seed,
    }

    return result
