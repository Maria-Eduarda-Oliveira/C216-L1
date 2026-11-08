from sqlalchemy.orm import Session

from app.repositories.item_repository import ItemRepository
from app.schemas import ItemCreate, ItemUpdate


class ItemService:
    def __init__(self, db: Session):
        self.repository = ItemRepository(db)

    def listar_items(self, concluida: bool | None = None):
        return self.repository.listar(concluida)

    def obter_item(self, item_id: int):
        return self.repository.obter_por_id(item_id)

    def criar_item(self, item: ItemCreate):
        return self.repository.criar(item)

    def atualizar_item(self, item_id: int, item: ItemCreate):
        return self.repository.atualizar(item_id, item)

    def atualizar_item_parcial(self, item_id: int, item: ItemUpdate):
        return self.repository.atualizar_parcial(item_id, item)

    def deletar_item(self, item_id: int) -> bool:
        return self.repository.deletar(item_id)
