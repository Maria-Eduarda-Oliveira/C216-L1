from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.db.models import StatusOrdemServico
from app.schemas import (
    OrdemServico,
    OrdemServicoCreate,
    OrdemServicoUpdate,
    StatusUpdate,
)
from app.services.ordem_servico_service import OrdemServicoService

router = APIRouter(prefix="/ordens-servico", tags=["ordens-servico"])


@router.get("/", response_model=list[OrdemServico])
def listar(
    equipamento_id: int | None = Query(default=None),
    status: StatusOrdemServico | None = Query(default=None),
    db: Session = Depends(get_db),
):
    return OrdemServicoService(db).listar(equipamento_id, status)


@router.get("/{os_id}", response_model=OrdemServico)
def obter(os_id: int, db: Session = Depends(get_db)):
    return OrdemServicoService(db).obter(os_id)


@router.post("/", response_model=OrdemServico, status_code=201)
def criar(dados: OrdemServicoCreate, db: Session = Depends(get_db)):
    return OrdemServicoService(db).criar(dados)


@router.patch("/{os_id}", response_model=OrdemServico)
def atualizar(os_id: int, dados: OrdemServicoUpdate, db: Session = Depends(get_db)):
    return OrdemServicoService(db).atualizar(os_id, dados)


@router.patch("/{os_id}/status", response_model=OrdemServico)
def alterar_status(os_id: int, dados: StatusUpdate, db: Session = Depends(get_db)):
    return OrdemServicoService(db).alterar_status(os_id, dados.status)


@router.delete("/{os_id}", status_code=204)
def deletar(os_id: int, db: Session = Depends(get_db)):
    OrdemServicoService(db).deletar(os_id)
