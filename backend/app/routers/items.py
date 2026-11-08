from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import Item, ItemCreate, ItemUpdate
from app.services.item_service import ItemService

router = APIRouter(prefix="/items", tags=["items"])


@router.get("/", response_model=list[Item])
def listar_items(
    concluida: bool | None = Query(
        default=None, description="Filtra por status de conclusao"),
    db: Session = Depends(get_db),
):
    return ItemService(db).listar_items(concluida)


@router.get("/{item_id}", response_model=Item)
def obter_item(item_id: int, db: Session = Depends(get_db)):
    item = ItemService(db).obter_item(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
    return item


@router.post("/", response_model=Item, status_code=201)
def criar_item(item: ItemCreate, db: Session = Depends(get_db)):
    try:
        return ItemService(db).criar_item(item)
    except ValueError as erro:
        raise HTTPException(status_code=409, detail=str(erro)) from erro


@router.put("/{item_id}", response_model=Item)
def atualizar_item(item_id: int, item: ItemCreate, db: Session = Depends(get_db)):
    item_atualizado = ItemService(db).atualizar_item(item_id, item)
    if not item_atualizado:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
    return item_atualizado


@router.patch("/{item_id}", response_model=Item)
def atualizar_item_parcial(
    item_id: int, item: ItemUpdate, db: Session = Depends(get_db)
):
    item_atualizado = ItemService(db).atualizar_item_parcial(item_id, item)
    if not item_atualizado:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
    return item_atualizado


@router.delete("/{item_id}", status_code=204)
def deletar_item(item_id: int, db: Session = Depends(get_db)):
    sucesso = ItemService(db).deletar_item(item_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Item nao encontrado")
