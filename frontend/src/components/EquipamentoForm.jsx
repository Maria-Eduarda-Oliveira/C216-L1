import { useState } from 'react';

export function EquipamentoForm({ inicial, rotulo, onSalvar, onCancelar }) {
  const [nome, setNome] = useState(inicial?.nome ?? '');
  const [local, setLocal] = useState(inicial?.local ?? '');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);
    try {
      await onSalvar({ nome: nome.trim(), local: local.trim() || null });
      if (!inicial) {
        setNome('');
        setLocal('');
      }
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="flex flex-col gap-3 rounded-lg bg-white p-4 shadow-sm">
      <div>
        <label htmlFor="equip-nome" className="block text-sm font-medium text-gray-700">
          Nome do equipamento
        </label>
        <input
          id="equip-nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="equip-local" className="block text-sm font-medium text-gray-700">
          Local
        </label>
        <input
          id="equip-local"
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>
      {erro && (
        <p role="alert" className="text-sm text-red-600">
          {erro}
        </p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {enviando ? 'Salvando...' : rotulo}
        </button>
        {onCancelar && (
          <button
            type="button"
            onClick={onCancelar}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
