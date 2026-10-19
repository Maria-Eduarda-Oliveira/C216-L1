import { ItemForm } from './components/ItemForm';
import { ItemList } from './components/ItemList';
import { useItems } from './hooks/useItems';

function App() {
  const { items, addItem, removeItem } = useItems();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-2xl flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Gerenciador de Itens</h1>
          <p className="text-sm text-gray-600">
            Cadastre, visualize e remova itens. Os dados ficam apenas nesta sessao.
          </p>
        </header>

        <ItemForm onAdicionar={addItem} />
        <ItemList items={items} onRemover={removeItem} />
      </div>
    </div>
  );
}

export default App;
