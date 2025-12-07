from dotenv import load_dotenv
load_dotenv(override=True)

from fastapi import FastAPI
from spoon_ai.payments.app import create_x402_app

from x402_config import X402_SERVICES

x402_app: FastAPI = create_x402_app(services=X402_SERVICES)

app = x402_app
