from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas import Task, TaskCreate, TaskUpdate
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/", response_model=list[Task])
def listar_tasks(
    concluida: bool | None = Query(
        default=None, description="Filtra por status de conclusao"),
    db: Session = Depends(get_db),
):
    return TaskService(db).listar_tasks(concluida)


@router.get("/{task_id}", response_model=Task)
def obter_task(task_id: int, db: Session = Depends(get_db)):
    task = TaskService(db).obter_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task nao encontrada")
    return task


@router.post("/", response_model=Task, status_code=201)
def criar_task(task: TaskCreate, db: Session = Depends(get_db)):
    return TaskService(db).criar_task(task)


@router.put("/{task_id}", response_model=Task)
def atualizar_task(task_id: int, task: TaskCreate, db: Session = Depends(get_db)):
    task_atualizada = TaskService(db).atualizar_task(task_id, task)
    if not task_atualizada:
        raise HTTPException(status_code=404, detail="Task nao encontrada")
    return task_atualizada


@router.patch("/{task_id}", response_model=Task)
def atualizar_task_parcial(
    task_id: int, task: TaskUpdate, db: Session = Depends(get_db)
):
    task_atualizada = TaskService(db).atualizar_task_parcial(task_id, task)
    if not task_atualizada:
        raise HTTPException(status_code=404, detail="Task nao encontrada")
    return task_atualizada


@router.delete("/{task_id}", status_code=204)
def deletar_task(task_id: int, db: Session = Depends(get_db)):
    sucesso = TaskService(db).deletar_task(task_id)
    if not sucesso:
        raise HTTPException(status_code=404, detail="Task nao encontrada")
