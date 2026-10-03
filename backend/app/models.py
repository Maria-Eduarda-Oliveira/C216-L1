from pydantic import BaseModel
from typing import Optional


class TaskBase(BaseModel):
    titulo: str
    descricao: Optional[str] = None
    concluida: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    titulo: Optional[str] = None
    descricao: Optional[str] = None
    concluida: Optional[bool] = None


class Task(TaskBase):
    id: int
