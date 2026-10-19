import { ItemCard } from './ItemCard';

export function ItemList({ items, onRemover }) {
  if (items.length === 0) {
    return <p className="text-sm text-gray-500">Nenhum item cadastrado ainda.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onRemover={onRemover} />
      ))}
    </ul>
  );
}
