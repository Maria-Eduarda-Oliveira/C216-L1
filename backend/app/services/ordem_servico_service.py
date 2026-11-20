from datetime import UTC, datetime

from sqlalchemy.orm import Session

from app.db.models import StatusOrdemServico
from app.exceptions import NaoEncontradoError, RegraDeNegocioError
from app.repositories.equipamento_repository import EquipamentoRepository
from app.repositories.ordem_servico_repository import OrdemServicoRepository
from app.schemas import OrdemServicoCreate, OrdemServicoUpdate

# Fluxo permitido: aberta -> em_andamento -> concluida (sem pular etapas nem voltar)
TRANSICOES_PERMITIDAS = {
    StatusOrdemServico.ABERTA: {StatusOrdemServico.EM_ANDAMENTO},
    StatusOrdemServico.EM_ANDAMENTO: {StatusOrdemServico.CONCLUIDA},
    StatusOrdemServico.CONCLUIDA: set(),
}


class OrdemServicoService:
    def __init__(self, db: Session):
        self.ordens = OrdemServicoRepository(db)
        self.equipamentos = EquipamentoRepository(db)

    def listar(self, equipamento_id=None, status=None):
        return self.ordens.listar(equipamento_id, status)

    def obter(self, os_id: int):
        ordem = self.ordens.obter_por_id(os_id)
        if not ordem:
            raise NaoEncontradoError("Ordem de servico nao encontrada")
        return ordem

    def criar(self, dados: OrdemServicoCreate):
        if not self.equipamentos.obter_por_id(dados.equipamento_id):
            raise NaoEncontradoError("Equipamento nao encontrado")
        return self.ordens.criar(dados.model_dump())

    def atualizar(self, os_id: int, dados: OrdemServicoUpdate):
        ordem = self.obter(os_id)
        if ordem.status == StatusOrdemServico.CONCLUIDA:
            raise RegraDeNegocioError(
                "Ordem de servico concluida nao pode ser editada"
            )
        for campo, valor in dados.model_dump(exclude_unset=True).items():
            setattr(ordem, campo, valor)
        return self.ordens.salvar(ordem)

    def alterar_status(self, os_id: int, novo_status: StatusOrdemServico):
        ordem = self.obter(os_id)
        permitidos = TRANSICOES_PERMITIDAS[ordem.status]
        if novo_status not in permitidos:
            raise RegraDeNegocioError(
                f"Transicao invalida: {ordem.status.value} -> {novo_status.value}"
            )
        ordem.status = novo_status
        if novo_status == StatusOrdemServico.CONCLUIDA:
            ordem.data_conclusao = datetime.now(UTC)
        return self.ordens.salvar(ordem)

    def deletar(self, os_id: int) -> None:
        ordem = self.obter(os_id)
        self.ordens.deletar(ordem)
