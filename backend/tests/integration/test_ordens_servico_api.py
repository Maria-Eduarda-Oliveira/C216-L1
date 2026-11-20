def test_criar_ordem(client, equipamento):
    resposta = client.post(
        "/ordens-servico/",
        json={
            "equipamento_id": equipamento["id"],
            "descricao_problema": "Ruido anormal",
            "responsavel": "Marina",
        },
    )
    assert resposta.status_code == 201
    assert resposta.json()["status"] == "aberta"


def test_criar_ordem_equipamento_inexistente(client):
    resposta = client.post(
        "/ordens-servico/",
        json={
            "equipamento_id": 999,
            "descricao_problema": "Ruido anormal",
            "responsavel": "Marina",
        },
    )
    assert resposta.status_code == 404


def test_listar_ordens_filtrando_por_status(client, ordem):
    assert len(client.get("/ordens-servico/?status=aberta").json()) == 1
    assert len(client.get("/ordens-servico/?status=concluida").json()) == 0


def test_fluxo_completo_de_status(client, ordem):
    url = f"/ordens-servico/{ordem['id']}/status"
    assert client.patch(
        url, json={"status": "em_andamento"}).status_code == 200
    resposta = client.patch(url, json={"status": "concluida"})
    assert resposta.status_code == 200
    assert resposta.json()["data_conclusao"] is not None


def test_nao_pode_pular_etapa(client, ordem):
    url = f"/ordens-servico/{ordem['id']}/status"
    resposta = client.patch(url, json={"status": "concluida"})
    assert resposta.status_code == 422
    assert "Transicao invalida" in resposta.json()["detail"]


def test_ordem_concluida_nao_pode_ser_editada(client, ordem):
    url = f"/ordens-servico/{ordem['id']}"
    client.patch(url + "/status", json={"status": "em_andamento"})
    client.patch(url + "/status", json={"status": "concluida"})
    resposta = client.patch(url, json={"responsavel": "Outra pessoa"})
    assert resposta.status_code == 422


def test_excluir_ordem(client, ordem):
    assert client.delete(f"/ordens-servico/{ordem['id']}").status_code == 204
    assert client.get(f"/ordens-servico/{ordem['id']}").status_code == 404
