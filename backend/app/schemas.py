from typing import Optional

from pydantic import BaseModel, ConfigDict


class ItemBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    concluida: bool = False


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    nome: Optional[str] = None
    descricao: Optional[str] = None
    concluida: Optional[bool] = None


class Item(ItemBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
