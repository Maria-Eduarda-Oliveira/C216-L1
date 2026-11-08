import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import items

app = FastAPI(title="C216 - API")

origens_permitidas = os.getenv(
    "CORS_ORIGINS", "http://localhost:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origens_permitidas,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(items.router)


@app.get("/health")
def health_check():
    return {"status": "ok"}
