
from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):
    titulo: str
    descricao: str | None = None
    concluida: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    titulo: str | None = None
    descricao: str | None = None
    concluida: bool | None = None


class Task(TaskBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
