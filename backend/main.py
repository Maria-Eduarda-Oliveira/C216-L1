import os

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.exceptions import ConflitoError, NaoEncontradoError, RegraDeNegocioError
from app.routers import equipamentos, ordens_servico

app = FastAPI(
    title="Gestao de Manutencao de Equipamentos",
    description="API para cadastro de equipamentos e controle de ordens de servico, "
    "com fluxo de status: aberta -> em_andamento -> concluida.",
)

origens = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origens,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


@app.exception_handler(NaoEncontradoError)
async def nao_encontrado_handler(_: Request, erro: NaoEncontradoError):
    return JSONResponse(status_code=404, content={"detail": str(erro)})


@app.exception_handler(ConflitoError)
async def conflito_handler(_: Request, erro: ConflitoError):
    return JSONResponse(status_code=409, content={"detail": str(erro)})


@app.exception_handler(RegraDeNegocioError)
async def regra_handler(_: Request, erro: RegraDeNegocioError):
    return JSONResponse(status_code=422, content={"detail": str(erro)})


app.include_router(equipamentos.router)
app.include_router(ordens_servico.router)


@app.get("/health")
def health():
    return {"status": "ok"}
