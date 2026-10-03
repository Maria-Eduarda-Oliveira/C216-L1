import pytest
from app.utils import somar, dividir, eh_par, eh_palindromo


@pytest.fixture
def numeros_exemplo():
    return {"a": 10, "b": 5}


def test_somar(numeros_exemplo):
    resultado = somar(numeros_exemplo["a"], numeros_exemplo["b"])
    assert resultado == 15


def test_dividir(numeros_exemplo):
    resultado = dividir(numeros_exemplo["a"], numeros_exemplo["b"])
    assert resultado == 2


def test_dividir_por_zero_lanca_erro():
    with pytest.raises(ValueError):
        dividir(10, 0)


@pytest.mark.parametrize("numero, esperado", [
    (2, True),
    (3, False),
    (0, True),
    (-4, True),
    (7, False),
])
def test_eh_par(numero, esperado):
    assert eh_par(numero) == esperado


@pytest.mark.parametrize("texto, esperado", [
    ("arara", True),
    ("python", False),
    ("Ovo", True),
    ("A man a plan a canal Panama".replace(" ", ""), True),
])
def test_eh_palindromo(texto, esperado):
    assert eh_palindromo(texto) == esperado
