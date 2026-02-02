import { useState, useMemo } from 'react';
import { useInventory } from './hooks/useInventory';
import { Header } from './components/Header';
import { InventoryList } from './components/InventoryList';
import { EmptyState } from './components/EmptyState';
import { AddItemModal } from './components/AddItemModal';
import { CategoryFilter } from './components/CategoryFilter';
import { CategoryManager } from './components/CategoryManager';

function App() {
  const {
    items,
    categories,
    categoryNames,
    addItem,
    updateItem,
    deleteItem,
    incrementCount,
    decrementCount,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useInventory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
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
            <div className="mb-6 flex items-center gap-2">
              <div className="flex-1">
                <CategoryFilter
                  categories={categoryNames}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  itemCounts={itemCounts}
                />
              </div>
              <button
                onClick={() => setIsCategoryManagerOpen(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Manage categories"
                title="Manage categories"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
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

      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        itemCounts={itemCounts}
        onUpdateCategory={updateCategory}
        onDeleteCategory={deleteCategory}
        onAddCategory={addCategory}
      />
    </div>
  );
}

export default App;
