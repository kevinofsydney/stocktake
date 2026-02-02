import { useState, useMemo } from 'react';
import { useInventory } from './hooks/useInventory';
import { Header } from './components/Header';
import { InventoryList } from './components/InventoryList';
import { EmptyState } from './components/EmptyState';
import { AddItemModal } from './components/AddItemModal';
import { CategoryFilter } from './components/CategoryFilter';

function App() {
  const {
    items,
    categoryNames,
    addItem,
    updateItem,
    deleteItem,
    incrementCount,
    decrementCount,
    addCategory,
  } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((item) => item.category === selectedCategory);
  }, [items, selectedCategory]);

  const itemCounts = useMemo(() => {
    return items.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [items]);

  const handleUpdateCount = (id: string, count: number) => {
    updateItem(id, { count });
  };

  const handleAddCategory = (name: string) => {
    addCategory(name);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddClick={() => setIsModalOpen(true)} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {items.length > 0 ? (
          <>
            <div className="mb-6">
              <CategoryFilter
                categories={categoryNames}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                itemCounts={itemCounts}
              />
            </div>

            {filteredItems.length > 0 ? (
              <InventoryList
                items={filteredItems}
                onUpdateCount={handleUpdateCount}
                onIncrement={incrementCount}
                onDecrement={decrementCount}
                onDelete={deleteItem}
              />
            ) : (
              <div className="text-center py-12 text-gray-500">
                No items in this category
              </div>
            )}
          </>
        ) : (
          <EmptyState onAddClick={() => setIsModalOpen(true)} />
        )}
      </main>

      {/* Floating Action Button for mobile */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="sm:hidden fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
        aria-label="Add new item"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addItem}
        onAddCategory={handleAddCategory}
        categories={categoryNames}
      />
    </div>
  );
}

export default App;
