import { useState } from 'react';

export function useItems() {
  const [items, setItems] = useState([]);

  const addItem = (item) => {
    const novoItem = { id: crypto.randomUUID(), ...item };
    setItems((prev) => [...prev, novoItem]);
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return { items, addItem, removeItem };
}
