from fastapi import FastAPI
from app.routers import tasks

app = FastAPI(title="C216 - API")

app.include_router(tasks.router)
