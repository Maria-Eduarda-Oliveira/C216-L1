export function ItemCard({ item }) {
  return (
    <li className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div>
        <h3 className="font-semibold text-gray-900">{item.nome}</h3>
        <p className="text-sm text-gray-600">{item.descricao}</p>
      </div>
    </li>
  );
}
