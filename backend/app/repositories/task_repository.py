from sqlalchemy.orm import Session

from app.db.models import TaskModel
from app.schemas import TaskCreate, TaskUpdate


class TaskRepository:
    def __init__(self, db: Session):
        self.db = db

    def listar(self, concluida: bool | None = None) -> list[TaskModel]:
        query = self.db.query(TaskModel)
        if concluida is not None:
            query = query.filter(TaskModel.concluida == concluida)
        return query.all()

    def obter_por_id(self, task_id: int) -> TaskModel | None:
        return self.db.query(TaskModel).filter(TaskModel.id == task_id).first()

    def criar(self, task: TaskCreate) -> TaskModel:
        nova_task = TaskModel(**task.model_dump())
        self.db.add(nova_task)
        self.db.commit()
        self.db.refresh(nova_task)
        return nova_task

    def atualizar(self, task_id: int, task: TaskCreate) -> TaskModel | None:
        task_existente = self.obter_por_id(task_id)
        if not task_existente:
            return None
        for campo, valor in task.model_dump().items():
            setattr(task_existente, campo, valor)
        self.db.commit()
        self.db.refresh(task_existente)
        return task_existente

    def atualizar_parcial(self, task_id: int, task: TaskUpdate) -> TaskModel | None:
        task_existente = self.obter_por_id(task_id)
        if not task_existente:
            return None
        for campo, valor in task.model_dump(exclude_unset=True).items():
            setattr(task_existente, campo, valor)
        self.db.commit()
        self.db.refresh(task_existente)
        return task_existente

    def deletar(self, task_id: int) -> bool:
        task_existente = self.obter_por_id(task_id)
        if not task_existente:
            return False
        self.db.delete(task_existente)
        self.db.commit()
        return True
