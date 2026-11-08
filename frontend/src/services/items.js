const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function listItems() {
  const response = await fetch(`${API_URL}/items/`);

  if (!response.ok) {
    throw new Error('Nao foi possivel carregar os itens');
  }

  return response.json();
}

export async function createItem(item) {
  const response = await fetch(`${API_URL}/items/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });

  if (response.status === 409) {
    const erro = await response.json();
    throw new Error(erro.detail || 'Ja existe um item com esse nome');
  }

  if (!response.ok) {
    throw new Error('Nao foi possivel criar o item');
  }

  return response.json();
}

export async function deleteItem(id) {
  const response = await fetch(`${API_URL}/items/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Nao foi possivel remover o item');
  }
}
