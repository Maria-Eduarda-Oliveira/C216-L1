from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import Equipamento, EquipamentoCreate, EquipamentoUpdate
from app.services.equipamento_service import EquipamentoService

router = APIRouter(prefix="/equipamentos", tags=["equipamentos"])


@router.get("/", response_model=list[Equipamento])
def listar(db: Session = Depends(get_db)):
    return EquipamentoService(db).listar()


@router.get("/{equipamento_id}", response_model=Equipamento)
def obter(equipamento_id: int, db: Session = Depends(get_db)):
    return EquipamentoService(db).obter(equipamento_id)


@router.post("/", response_model=Equipamento, status_code=201)
def criar(dados: EquipamentoCreate, db: Session = Depends(get_db)):
    return EquipamentoService(db).criar(dados)


@router.patch("/{equipamento_id}", response_model=Equipamento)
def atualizar(
    equipamento_id: int, dados: EquipamentoUpdate, db: Session = Depends(get_db)
):
    return EquipamentoService(db).atualizar(equipamento_id, dados)


@router.delete("/{equipamento_id}", status_code=204)
def deletar(equipamento_id: int, db: Session = Depends(get_db)):
    EquipamentoService(db).deletar(equipamento_id)
