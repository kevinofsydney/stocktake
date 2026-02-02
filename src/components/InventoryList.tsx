import type { Item } from '../types';
import { InventoryItem } from './InventoryItem';

interface InventoryListProps {
  items: Item[];
  onUpdateCount: (id: string, count: number) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
}

export function InventoryList({
  items,
  onUpdateCount,
  onIncrement,
  onDecrement,
  onDelete,
}: InventoryListProps) {
  return (
    <div className="w-full">
      {/* Desktop table view */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Item
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Category
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                Count
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 w-16">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <InventoryItem
                key={item.id}
                item={item}
                onUpdateCount={onUpdateCount}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden flex flex-col gap-3">
        {items.map((item) => (
          <InventoryItem
            key={item.id}
            item={item}
            onUpdateCount={onUpdateCount}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
