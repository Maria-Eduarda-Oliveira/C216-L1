import { useCallback, useEffect, useState } from 'react';
import { createItem, listItems } from '../services/items';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const dados = await listItems();
      setItems(dados);
    } catch {
      setError('Nao foi possivel carregar os itens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarItems();
  }, [carregarItems]);

  async function addItem(item) {
    const novoItem = await createItem(item);
    setItems((prev) => [...prev, novoItem]);
  }

  return { items, loading, error, addItem, recarregar: carregarItems };
}
