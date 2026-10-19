export function validarItem({ nome, descricao }) {
  const erros = {};

  if (!nome || nome.trim().length < 3) {
    erros.nome = 'O nome deve ter pelo menos 3 caracteres';
  }

  if (!descricao || descricao.trim().length < 5) {
    erros.descricao = 'A descricao deve ter pelo menos 5 caracteres';
  }

  return erros;
}
