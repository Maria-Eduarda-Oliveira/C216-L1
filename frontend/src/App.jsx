import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { useItems } from './hooks/useItems';

function App() {
  const { items, loading, error, addItem } = useItems();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Itens</h1>
          <p className="text-sm text-gray-600">
            Cadastre e visualize itens. Os dados ficam salvos no banco de dados.
          </p>
        </header>

        <ItemForm onAdicionar={addItem} />

        {loading && <p className="text-sm text-gray-500">Carregando itens...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {!loading && !error && <ItemList items={items} />}
      </div>
    </div>
  );
}

export default App;
