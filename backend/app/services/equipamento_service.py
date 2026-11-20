from sqlalchemy.orm import Session

from app.exceptions import ConflitoError, NaoEncontradoError
from app.repositories.equipamento_repository import EquipamentoRepository
from app.repositories.ordem_servico_repository import OrdemServicoRepository
from app.schemas import EquipamentoCreate, EquipamentoUpdate


class EquipamentoService:
    def __init__(self, db: Session):
        self.equipamentos = EquipamentoRepository(db)
        self.ordens = OrdemServicoRepository(db)

    def listar(self):
        return self.equipamentos.listar()

    def obter(self, equipamento_id: int):
        equipamento = self.equipamentos.obter_por_id(equipamento_id)
        if not equipamento:
            raise NaoEncontradoError("Equipamento nao encontrado")
        return equipamento

    def criar(self, dados: EquipamentoCreate):
        if self.equipamentos.obter_por_nome(dados.nome):
            raise ConflitoError("Ja existe um equipamento com esse nome")
        return self.equipamentos.criar(dados.model_dump())

    def atualizar(self, equipamento_id: int, dados: EquipamentoUpdate):
        equipamento = self.obter(equipamento_id)
        alteracoes = dados.model_dump(exclude_unset=True)

        novo_nome = alteracoes.get("nome")
        if (
            novo_nome
            and novo_nome != equipamento.nome
            and self.equipamentos.obter_por_nome(novo_nome)
        ):
            raise ConflitoError("Ja existe um equipamento com esse nome")

        for campo, valor in alteracoes.items():
            setattr(equipamento, campo, valor)
        return self.equipamentos.salvar(equipamento)

    def deletar(self, equipamento_id: int) -> None:
        equipamento = self.obter(equipamento_id)
        if self.ordens.contar_nao_concluidas(equipamento_id) > 0:
            raise ConflitoError(
                "Nao e possivel excluir equipamento com ordens de servico em aberto"
            )
        self.equipamentos.deletar(equipamento)
