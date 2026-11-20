def test_criar_equipamento(client):
    resposta = client.post("/equipamentos/", json={"nome": "Bomba hidraulica"})
    assert resposta.status_code == 201
    assert resposta.json()["nome"] == "Bomba hidraulica"


def test_criar_equipamento_nome_duplicado(client, equipamento):
    resposta = client.post(
        "/equipamentos/", json={"nome": equipamento["nome"]})
    assert resposta.status_code == 409


def test_criar_equipamento_nome_curto_retorna_422(client):
    resposta = client.post("/equipamentos/", json={"nome": "ab"})
    assert resposta.status_code == 422


def test_listar_equipamentos(client, equipamento):
    resposta = client.get("/equipamentos/")
    assert resposta.status_code == 200
    assert len(resposta.json()) == 1


def test_obter_equipamento_inexistente(client):
    assert client.get("/equipamentos/999").status_code == 404


def test_atualizar_equipamento(client, equipamento):
    resposta = client.patch(
        f"/equipamentos/{equipamento['id']}", json={"local": "Galpao B"}
    )
    assert resposta.status_code == 200
    assert resposta.json()["local"] == "Galpao B"


def test_excluir_equipamento_sem_ordens(client, equipamento):
    assert client.delete(
        f"/equipamentos/{equipamento['id']}").status_code == 204
    assert client.get(f"/equipamentos/{equipamento['id']}").status_code == 404


def test_nao_exclui_equipamento_com_ordem_em_aberto(client, equipamento, ordem):
    resposta = client.delete(f"/equipamentos/{equipamento['id']}")
    assert resposta.status_code == 409
