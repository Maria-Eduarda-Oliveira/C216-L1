from fastapi import APIRouter, HTTPException, Query
from app.models import Task, TaskCreate, TaskUpdate

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Armazenamento em memoria (simples, para fins didaticos)
tasks_db: list[Task] = []
next_id = 1


@router.get("/", response_model=list[Task])
def listar_tasks(concluida: bool | None = Query(default=None, description="Filtra por status de conclusao")):
    if concluida is None:
        return tasks_db
    return [t for t in tasks_db if t.concluida == concluida]


@router.get("/{task_id}", response_model=Task)
def obter_task(task_id: int):
    for task in tasks_db:
        if task.id == task_id:
            return task
    raise HTTPException(status_code=404, detail="Task nao encontrada")


@router.post("/", response_model=Task, status_code=201)
def criar_task(task: TaskCreate):
    global next_id
    nova_task = Task(id=next_id, **task.model_dump())
    tasks_db.append(nova_task)
    next_id += 1
    return nova_task


@router.put("/{task_id}", response_model=Task)
def atualizar_task(task_id: int, task_atualizada: TaskCreate):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            tasks_db[i] = Task(id=task_id, **task_atualizada.model_dump())
            return tasks_db[i]
    raise HTTPException(status_code=404, detail="Task nao encontrada")


@router.patch("/{task_id}", response_model=Task)
def atualizar_task_parcial(task_id: int, task_atualizada: TaskUpdate):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            dados_atuais = task.model_dump()
            dados_novos = task_atualizada.model_dump(exclude_unset=True)
            dados_atuais.update(dados_novos)
            tasks_db[i] = Task(**dados_atuais)
            return tasks_db[i]
    raise HTTPException(status_code=404, detail="Task nao encontrada")


@router.delete("/{task_id}", status_code=204)
def deletar_task(task_id: int):
    for i, task in enumerate(tasks_db):
        if task.id == task_id:
            tasks_db.pop(i)
            return
    raise HTTPException(status_code=404, detail="Task nao encontrada")
