const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

async function requisitar(caminho, opcoes = {}) {
  let resposta;
  try {
    resposta = await fetch(`${API_URL}${caminho}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
    });
  } catch {
    throw new Error('Nao foi possivel conectar ao servidor');
  }

  if (resposta.status === 204) return null;

  const dados = await resposta.json().catch(() => null);

  if (!resposta.ok) {
    const detalhe = dados?.detail;
    const mensagem =
      typeof detalhe === 'string' ? detalhe : 'Dados invalidos. Verifique os campos informados';
    throw new Error(mensagem);
  }

  return dados;
}

export const listarEquipamentos = () => requisitar('/equipamentos/');

export const criarEquipamento = (dados) =>
  requisitar('/equipamentos/', { method: 'POST', body: JSON.stringify(dados) });

export const atualizarEquipamento = (id, dados) =>
  requisitar(`/equipamentos/${id}`, { method: 'PATCH', body: JSON.stringify(dados) });

export const excluirEquipamento = (id) => requisitar(`/equipamentos/${id}`, { method: 'DELETE' });

export const listarOrdens = (equipamentoId) =>
  requisitar(`/ordens-servico/?equipamento_id=${equipamentoId}`);

export const criarOrdem = (dados) =>
  requisitar('/ordens-servico/', { method: 'POST', body: JSON.stringify(dados) });

export const alterarStatusOrdem = (id, status) =>
  requisitar(`/ordens-servico/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const excluirOrdem = (id) => requisitar(`/ordens-servico/${id}`, { method: 'DELETE' });
