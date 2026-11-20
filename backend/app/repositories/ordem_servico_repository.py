from sqlalchemy.orm import Session

from app.db.models import OrdemServicoModel, StatusOrdemServico


class OrdemServicoRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(
        self,
        equipamento_id: int | None = None,
        status: StatusOrdemServico | None = None,
    ) -> list[OrdemServicoModel]:
        query = self.db.query(OrdemServicoModel)
        if equipamento_id is not None:
            query = query.filter(
                OrdemServicoModel.equipamento_id == equipamento_id)
        if status is not None:
            query = query.filter(OrdemServicoModel.status == status)
        return query.order_by(OrdemServicoModel.id.desc()).all()

    def obter_por_id(self, os_id: int) -> OrdemServicoModel | None:
        return (
            self.db.query(OrdemServicoModel)
            .filter(OrdemServicoModel.id == os_id)
            .first()
        )

    def contar_nao_concluidas(self, equipamento_id: int) -> int:
        return (
            self.db.query(OrdemServicoModel)
            .filter(
                OrdemServicoModel.equipamento_id == equipamento_id,
                OrdemServicoModel.status != StatusOrdemServico.CONCLUIDA,
            )
            .count()
        )

    def criar(self, dados: dict) -> OrdemServicoModel:
        ordem = OrdemServicoModel(**dados)
        self.db.add(ordem)
        self.db.commit()
        self.db.refresh(ordem)
        return ordem

    def salvar(self, ordem: OrdemServicoModel) -> OrdemServicoModel:
        self.db.commit()
        self.db.refresh(ordem)
        return ordem

    def deletar(self, ordem: OrdemServicoModel) -> None:
        self.db.delete(ordem)
        self.db.commit()
