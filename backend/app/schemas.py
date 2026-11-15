from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.db.models import StatusOrdemServico


class EquipamentoCreate(BaseModel):
    nome: str = Field(min_length=3, max_length=100)
    local: str | None = Field(default=None, max_length=100)


class EquipamentoUpdate(BaseModel):
    nome: str | None = Field(default=None, min_length=3, max_length=100)
    local: str | None = Field(default=None, max_length=100)


class Equipamento(BaseModel):
    id: int
    nome: str
    local: str | None

    model_config = ConfigDict(from_attributes=True)


class OrdemServicoCreate(BaseModel):
    equipamento_id: int
    descricao_problema: str = Field(min_length=5)
    responsavel: str = Field(min_length=3, max_length=100)


class OrdemServicoUpdate(BaseModel):
    descricao_problema: str | None = Field(default=None, min_length=5)
    responsavel: str | None = Field(default=None, min_length=3, max_length=100)


class StatusUpdate(BaseModel):
    status: StatusOrdemServico


class OrdemServico(BaseModel):
    id: int
    equipamento_id: int
    descricao_problema: str
    responsavel: str
    status: StatusOrdemServico
    data_abertura: datetime | None
    data_conclusao: datetime | None

    model_config = ConfigDict(from_attributes=True)
