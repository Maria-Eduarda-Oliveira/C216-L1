import enum

from sqlalchemy import Column, DateTime, Enum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database import Base


class StatusOrdemServico(str, enum.Enum):
    ABERTA = "aberta"
    EM_ANDAMENTO = "em_andamento"
    CONCLUIDA = "concluida"


class EquipamentoModel(Base):
    __tablename__ = "equipamentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False, unique=True, index=True)
    local = Column(String, nullable=True)

    ordens_servico = relationship(
        "OrdemServicoModel", back_populates="equipamento", cascade="all, delete-orphan"
    )


class OrdemServicoModel(Base):
    __tablename__ = "ordens_servico"

    id = Column(Integer, primary_key=True, index=True)
    equipamento_id = Column(Integer, ForeignKey(
        "equipamentos.id"), nullable=False)
    descricao_problema = Column(Text, nullable=False)
    responsavel = Column(String, nullable=False)
    status = Column(
        Enum(StatusOrdemServico), nullable=False, default=StatusOrdemServico.ABERTA
    )
    data_abertura = Column(DateTime(timezone=True), server_default=func.now())
    data_conclusao = Column(DateTime(timezone=True), nullable=True)

    equipamento = relationship(
        "EquipamentoModel", back_populates="ordens_servico")
