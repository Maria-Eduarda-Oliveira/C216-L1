import { useState } from 'react';
import { EquipamentoForm } from './EquipamentoForm';
import { OrdensServico } from './OrdensServico';

export function EquipamentoCard({ equipamento, onAtualizar, onExcluir }) {
  const [editando, setEditando] = useState(false);
  const [mostrarOrdens, setMostrarOrdens] = useState(false);
  const [erro, setErro] = useState(null);

  async function excluir() {
    setErro(null);
    try {
      await onExcluir(equipamento.id);
    } catch (e) {
      setErro(e.message);
    }
  }

  if (editando) {
    return (
      <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <EquipamentoForm
          inicial={equipamento}
          rotulo="Salvar alterações"
          onSalvar={async (dados) => {
            await onAtualizar(equipamento.id, dados);
            setEditando(false);
          }}
          onCancelar={() => setEditando(false)}
        />
      </li>
    );
  }

  return (
    <li className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-900">{equipamento.nome}</h3>
          <p className="text-sm text-gray-600">{equipamento.local || 'Local não informado'}</p>
        </div>
        <div className="flex gap-2 text-sm">
          <button
            type="button"
            onClick={() => setMostrarOrdens((v) => !v)}
            className="text-blue-600 hover:underline"
          >
            {mostrarOrdens ? 'Ocultar ordens' : 'Ver ordens'}
          </button>
          <button
            type="button"
            onClick={() => setEditando(true)}
            className="text-gray-700 hover:underline"
          >
            Editar
          </button>
          <button type="button" onClick={excluir} className="text-red-600 hover:underline">
            Excluir
          </button>
        </div>
      </div>
      {erro && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {erro}
        </p>
      )}
      {mostrarOrdens && <OrdensServico equipamento={equipamento} />}
    </li>
  );
}
