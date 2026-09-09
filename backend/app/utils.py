def somar(a: float, b: float) -> float:
    return a + b


def dividir(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Não é possível dividir por zero")
    return a / b


def eh_par(numero: int) -> bool:
    return numero % 2 == 0


def eh_palindromo(texto: str) -> bool:
    texto_limpo = texto.lower().replace(" ", "")
    return texto_limpo == texto_limpo[::-1]
