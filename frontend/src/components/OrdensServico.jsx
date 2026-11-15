import { useCallback, useEffect, useState } from 'react';
import { alterarStatusOrdem, criarOrdem, excluirOrdem, listarOrdens } from '../services/api';

const PROXIMO_STATUS = { aberta: 'em_andamento', em_andamento: 'concluida' };
const ROTULO_STATUS = { aberta: 'Aberta', em_andamento: 'Em andamento', concluida: 'Concluída' };
const ROTULO_ACAO = { aberta: 'Iniciar', em_andamento: 'Concluir' };

export function OrdensServico({ equipamento, onMudou }) {
  const [ordens, setOrdens] = useState([]);
  const [descricao, setDescricao] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [erro, setErro] = useState(null);

  const carregar = useCallback(async () => {
    try {
      setOrdens(await listarOrdens(equipamento.id));
    } catch (e) {
      setErro(e.message);
    }
  }, [equipamento.id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function executar(acao) {
    setErro(null);
    try {
      await acao();
      await carregar();
      onMudou?.();
    } catch (e) {
      setErro(e.message);
    }
  }

  function abrirOrdem(evento) {
    evento.preventDefault();
    executar(async () => {
      await criarOrdem({
        equipamento_id: equipamento.id,
        descricao_problema: descricao.trim(),
        responsavel: responsavel.trim(),
      });
      setDescricao('');
      setResponsavel('');
    });
  }

  return (
    <section className="mt-3 rounded-md bg-gray-50 p-3">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">Ordens de serviço</h4>

      <form onSubmit={abrirOrdem} className="mb-3 flex flex-col gap-2">
        <input
          aria-label="Descrição do problema"
          placeholder="Descrição do problema"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          aria-label="Responsável"
          placeholder="Responsável"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="self-start rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
        >
          Abrir ordem
        </button>
      </form>

      {erro && (
        <p role="alert" className="mb-2 text-sm text-red-600">
          {erro}
        </p>
      )}

      {ordens.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhuma ordem de serviço.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {ordens.map((ordem) => (
            <li
              key={ordem.id}
              className="flex items-center justify-between gap-2 rounded-md bg-white p-2 text-sm shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-900">{ordem.descricao_problema}</p>
                <p className="text-gray-600">
                  {ordem.responsavel} · {ROTULO_STATUS[ordem.status]}
                </p>
              </div>
              <div className="flex gap-2">
                {PROXIMO_STATUS[ordem.status] && (
                  <button
                    type="button"
                    onClick={() =>
                      executar(() => alterarStatusOrdem(ordem.id, PROXIMO_STATUS[ordem.status]))
                    }
                    className="rounded-md bg-green-600 px-2 py-1 text-white hover:bg-green-700"
                  >
                    {ROTULO_ACAO[ordem.status]}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => executar(() => excluirOrdem(ordem.id))}
                  className="rounded-md px-2 py-1 text-red-600 hover:bg-red-50"
                >
                  Excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
