import pytest

from app.db.models import StatusOrdemServico
from app.services.ordem_servico_service import TRANSICOES_PERMITIDAS


@pytest.mark.parametrize(
    "origem, destino, permitido",
    [
        (StatusOrdemServico.ABERTA, StatusOrdemServico.EM_ANDAMENTO, True),
        (StatusOrdemServico.EM_ANDAMENTO, StatusOrdemServico.CONCLUIDA, True),
        (StatusOrdemServico.ABERTA, StatusOrdemServico.CONCLUIDA, False),
        (StatusOrdemServico.EM_ANDAMENTO, StatusOrdemServico.ABERTA, False),
        (StatusOrdemServico.CONCLUIDA, StatusOrdemServico.EM_ANDAMENTO, False),
        (StatusOrdemServico.CONCLUIDA, StatusOrdemServico.ABERTA, False),
    ],
)
def test_transicoes_de_status(origem, destino, permitido):
    assert (destino in TRANSICOES_PERMITIDAS[origem]) is permitido
