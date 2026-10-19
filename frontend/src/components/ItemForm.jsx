import { useState } from 'react';
import { validarItem } from '../utils/validation';

export function ItemForm({ onAdicionar }) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erros, setErros] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    const errosEncontrados = validarItem({ nome, descricao });
    setErros(errosEncontrados);

    if (Object.keys(errosEncontrados).length > 0) {
      return;
    }

    onAdicionar({ nome: nome.trim(), descricao: descricao.trim() });
    setNome('');
    setDescricao('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-white p-4 rounded-lg shadow-sm">
      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
          Nome
        </label>
        <input
          id="nome"
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {erros.nome && <p className="text-sm text-red-600 mt-1">{erros.nome}</p>}
      </div>

      <div>
        <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
          Descricao
        </label>
        <textarea
          id="descricao"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {erros.descricao && <p className="text-sm text-red-600 mt-1">{erros.descricao}</p>}
      </div>

      <button
        type="submit"
        className="self-start rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Adicionar item
      </button>
    </form>
  );
}
