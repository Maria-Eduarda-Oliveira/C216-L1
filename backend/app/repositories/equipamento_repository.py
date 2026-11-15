from sqlalchemy.orm import Session

from app.db.models import EquipamentoModel


class EquipamentoRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(self) -> list[EquipamentoModel]:
        return self.db.query(EquipamentoModel).order_by(EquipamentoModel.nome).all()

    def obter_por_id(self, equipamento_id: int) -> EquipamentoModel | None:
        return (
            self.db.query(EquipamentoModel)
            .filter(EquipamentoModel.id == equipamento_id)
            .first()
        )

    def obter_por_nome(self, nome: str) -> EquipamentoModel | None:
        return (
            self.db.query(EquipamentoModel).filter(
                EquipamentoModel.nome == nome).first()
        )

    def criar(self, dados: dict) -> EquipamentoModel:
        equipamento = EquipamentoModel(**dados)
        self.db.add(equipamento)
        self.db.commit()
        self.db.refresh(equipamento)
        return equipamento

    def salvar(self, equipamento: EquipamentoModel) -> EquipamentoModel:
        self.db.commit()
        self.db.refresh(equipamento)
        return equipamento

    def deletar(self, equipamento: EquipamentoModel) -> None:
        self.db.delete(equipamento)
        self.db.commit()
