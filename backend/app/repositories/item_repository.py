from sqlalchemy.orm import Session

from app.db.models import ItemModel
from app.schemas import ItemCreate, ItemUpdate


class ItemRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(self, concluida: bool | None = None) -> list[ItemModel]:
        query = self.db.query(ItemModel)
        if concluida is not None:
            query = query.filter(ItemModel.concluida == concluida)
        return query.all()

    def obter_por_id(self, item_id: int) -> ItemModel | None:
        return self.db.query(ItemModel).filter(ItemModel.id == item_id).first()

    def obter_por_nome(self, nome: str) -> ItemModel | None:
        return self.db.query(ItemModel).filter(ItemModel.nome == nome).first()

    def criar(self, item: ItemCreate) -> ItemModel:
        if self.obter_por_nome(item.nome):
            raise ValueError("Ja existe um item com esse nome")

        novo_item = ItemModel(**item.model_dump())
        self.db.add(novo_item)
        self.db.commit()
        self.db.refresh(novo_item)
        return novo_item

    def atualizar(self, item_id: int, item: ItemCreate) -> ItemModel | None:
        item_existente = self.obter_por_id(item_id)
        if not item_existente:
            return None
        for campo, valor in item.model_dump().items():
            setattr(item_existente, campo, valor)
        self.db.commit()
        self.db.refresh(item_existente)
        return item_existente

    def atualizar_parcial(self, item_id: int, item: ItemUpdate) -> ItemModel | None:
        item_existente = self.obter_por_id(item_id)
        if not item_existente:
            return None
        for campo, valor in item.model_dump(exclude_unset=True).items():
            setattr(item_existente, campo, valor)
        self.db.commit()
        self.db.refresh(item_existente)
        return item_existente

    def deletar(self, item_id: int) -> bool:
        item_existente = self.obter_por_id(item_id)
        if not item_existente:
            return False
        self.db.delete(item_existente)
        self.db.commit()
        return True
