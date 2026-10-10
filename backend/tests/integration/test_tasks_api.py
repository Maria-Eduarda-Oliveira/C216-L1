import pytest
from fastapi.testclient import TestClient
from main import app
from app.routers import tasks as tasks_router

client = TestClient(app)


@pytest.fixture(autouse=True)
def limpar_banco():
    tasks_router.tasks_db.clear()
    tasks_router.next_id = 1
    yield
    tasks_router.tasks_db.clear()


def test_criar_task():
    response = client.post("/tasks/", json={"titulo": "Estudar FastAPI"})
    assert response.status_code == 201
    assert response.json()["titulo"] == "Estudar FastAPI"
    assert response.json()["concluida"] is False


def test_listar_tasks():
    client.post("/tasks/", json={"titulo": "Tarefa 1"})
    client.post("/tasks/", json={"titulo": "Tarefa 2"})
    response = client.get("/tasks/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_listar_tasks_com_query_param():
    client.post(
        "/tasks/", json={"titulo": "Tarefa concluida", "concluida": True})
    client.post(
        "/tasks/", json={"titulo": "Tarefa pendente", "concluida": False})
    response = client.get("/tasks/?concluida=true")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["titulo"] == "Tarefa concluida"


def test_obter_task_existente():
    criada = client.post("/tasks/", json={"titulo": "Tarefa unica"}).json()
    response = client.get(f"/tasks/{criada['id']}")
    assert response.status_code == 200
    assert response.json()["titulo"] == "Tarefa unica"


def test_obter_task_inexistente():
    response = client.get("/tasks/999")
    assert response.status_code == 404


def test_atualizar_task_put():
    criada = client.post("/tasks/", json={"titulo": "Antiga"}).json()
    response = client.put(
        f"/tasks/{criada['id']}", json={"titulo": "Nova", "concluida": True})
    assert response.status_code == 200
    assert response.json()["titulo"] == "Nova"
    assert response.json()["concluida"] is True


def test_atualizar_task_patch():
    criada = client.post(
        "/tasks/", json={"titulo": "Parcial", "concluida": False}).json()
    response = client.patch(f"/tasks/{criada['id']}", json={"concluida": True})
    assert response.status_code == 200
    assert response.json()["titulo"] == "Parcial"
    assert response.json()["concluida"] is True


def test_deletar_task():
    criada = client.post("/tasks/", json={"titulo": "Para deletar"}).json()
    response = client.delete(f"/tasks/{criada['id']}")
    assert response.status_code == 204
    response_get = client.get(f"/tasks/{criada['id']}")
    assert response_get.status_code == 404


def test_deletar_task_inexistente():
    response = client.delete("/tasks/999")
    assert response.status_code == 404
