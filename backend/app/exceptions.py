class NaoEncontradoError(Exception):
    """Recurso inexistente (vira HTTP 404)."""


class ConflitoError(Exception):
    """Conflito com o estado atual dos dados (vira HTTP 409)."""


class RegraDeNegocioError(Exception):
    """Operação inválida segundo as regras do domínio (vira HTTP 422)."""
