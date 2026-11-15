import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.db import models  # noqa: F401
from main import app

engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(autouse=True)
def banco_limpo():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def equipamento(client):
    resposta = client.post(
        "/equipamentos/", json={"nome": "Compressor de ar", "local": "Galpao A"}
    )
    return resposta.json()


@pytest.fixture
def ordem(client, equipamento):
    resposta = client.post(
        "/ordens-servico/",
        json={
            "equipamento_id": equipamento["id"],
            "descricao_problema": "Vazamento de oleo",
            "responsavel": "Carlos",
        },
    )
    return resposta.json()
