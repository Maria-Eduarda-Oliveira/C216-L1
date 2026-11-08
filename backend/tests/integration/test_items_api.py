def test_criar_item(client):
    response = client.post("/items/", json={"nome": "Caderno"})
    assert response.status_code == 201
    assert response.json()["nome"] == "Caderno"
    assert response.json()["concluida"] is False


def test_criar_item_com_nome_duplicado_retorna_409(client):
    client.post("/items/", json={"nome": "Caderno"})
    response = client.post("/items/", json={"nome": "Caderno"})
    assert response.status_code == 409
    assert "ja existe" in response.json()["detail"].lower(
    ) or "já existe" in response.json()["detail"].lower()


def test_listar_items(client):
    client.post("/items/", json={"nome": "Item 1"})
    client.post("/items/", json={"nome": "Item 2"})
    response = client.get("/items/")
    assert response.status_code == 200
    assert len(response.json()) == 2


def test_listar_items_com_query_param(client):
    client.post("/items/", json={"nome": "Item concluido", "concluida": True})
    client.post("/items/", json={"nome": "Item pendente", "concluida": False})
    response = client.get("/items/?concluida=true")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["nome"] == "Item concluido"


def test_obter_item_existente(client):
    criado = client.post("/items/", json={"nome": "Item unico"}).json()
    response = client.get(f"/items/{criado['id']}")
    assert response.status_code == 200
    assert response.json()["nome"] == "Item unico"


def test_obter_item_inexistente(client):
    response = client.get("/items/999")
    assert response.status_code == 404


def test_atualizar_item_put(client):
    criado = client.post("/items/", json={"nome": "Antigo"}).json()
    response = client.put(
        f"/items/{criado['id']}", json={"nome": "Novo", "concluida": True})
    assert response.status_code == 200
    assert response.json()["nome"] == "Novo"
    assert response.json()["concluida"] is True


def test_atualizar_item_patch(client):
    criado = client.post(
        "/items/", json={"nome": "Parcial", "concluida": False}).json()
    response = client.patch(f"/items/{criado['id']}", json={"concluida": True})
    assert response.status_code == 200
    assert response.json()["nome"] == "Parcial"
    assert response.json()["concluida"] is True


def test_deletar_item(client):
    criado = client.post("/items/", json={"nome": "Para deletar"}).json()
    response = client.delete(f"/items/{criado['id']}")
    assert response.status_code == 204
    response_get = client.get(f"/items/{criado['id']}")
    assert response_get.status_code == 404


def test_deletar_item_inexistente(client):
    response = client.delete("/items/999")
    assert response.status_code == 404
