export function ItemCard({ item, onRemover }) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="font-semibold text-gray-900">{item.nome}</h3>
        <p className="text-sm text-gray-600">{item.descricao}</p>
      </div>
      <button
        type="button"
        onClick={() => onRemover(item.id)}
        className="text-sm font-medium text-red-600 hover:text-red-700"
      >
        Remover
      </button>
    </li>
  );
}
