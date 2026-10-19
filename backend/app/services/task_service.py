from sqlalchemy.orm import Session

from app.repositories.task_repository import TaskRepository
from app.schemas import TaskCreate, TaskUpdate


class TaskService:
    def __init__(self, db: Session):
        self.repository = TaskRepository(db)

    def listar_tasks(self, concluida: bool | None = None):
        return self.repository.listar(concluida)

    def obter_task(self, task_id: int):
        return self.repository.obter_por_id(task_id)

    def criar_task(self, task: TaskCreate):
        return self.repository.criar(task)

    def atualizar_task(self, task_id: int, task: TaskCreate):
        return self.repository.atualizar(task_id, task)

    def atualizar_task_parcial(self, task_id: int, task: TaskUpdate):
        return self.repository.atualizar_parcial(task_id, task)

    def deletar_task(self, task_id: int) -> bool:
        return self.repository.deletar(task_id)
