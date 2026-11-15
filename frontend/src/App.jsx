import { EquipamentoCard } from './components/EquipamentoCard';
import { EquipamentoForm } from './components/EquipamentoForm';
import { useEquipamentos } from './hooks/useEquipamentos';

function App() {
  const { equipamentos, carregando, erro, criar, atualizar, excluir } = useEquipamentos();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Manutenção de Equipamentos</h1>
          <p className="text-sm text-gray-600">
            Cadastre equipamentos e acompanhe as ordens de serviço de cada um.
          </p>
        </header>

        <EquipamentoForm rotulo="Cadastrar equipamento" onSalvar={criar} />

        {carregando && <p className="text-sm text-gray-500">Carregando equipamentos...</p>}
        {erro && (
          <p role="alert" className="text-sm text-red-600">
            {erro}
          </p>
        )}
        {!carregando && !erro && equipamentos.length === 0 && (
          <p className="text-sm text-gray-500">Nenhum equipamento cadastrado.</p>
        )}

        <ul className="flex flex-col gap-3">
          {equipamentos.map((equipamento) => (
            <EquipamentoCard
              key={equipamento.id}
              equipamento={equipamento}
              onAtualizar={atualizar}
              onExcluir={excluir}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
