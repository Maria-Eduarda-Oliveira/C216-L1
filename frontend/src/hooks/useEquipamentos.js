import { useCallback, useEffect, useState } from 'react';
import {
  atualizarEquipamento,
  criarEquipamento,
  excluirEquipamento,
  listarEquipamentos,
} from '../services/api';

export function useEquipamentos() {
  const [equipamentos, setEquipamentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      setEquipamentos(await listarEquipamentos());
    } catch (e) {
      setErro(e.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function criar(dados) {
    await criarEquipamento(dados);
    await carregar();
  }

  async function atualizar(id, dados) {
    await atualizarEquipamento(id, dados);
    await carregar();
  }

  async function excluir(id) {
    await excluirEquipamento(id);
    await carregar();
  }

  return { equipamentos, carregando, erro, criar, atualizar, excluir };
}
