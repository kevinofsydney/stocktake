import { useState, useRef, useEffect } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, count: number, category: string) => void;
  onAddCategory: (name: string) => void;
  categories: string[];
}

export function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  onAddCategory,
  categories,
}: AddItemModalProps) {
  const [name, setName] = useState('');
  const [count, setCount] = useState('1');
  const [category, setCategory] = useState(categories[0] || '');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [filteredCategories, setFilteredCategories] = useState(categories);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState('');

  const nameInputRef = useRef<HTMLInputElement>(null);
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (showCategoryInput && categoryInputRef.current) {
      categoryInputRef.current.focus();
    }
  }, [showCategoryInput]);

  useEffect(() => {
    setFilteredCategories(
      categories.filter((cat) =>
        cat.toLowerCase().includes(category.toLowerCase())
      )
    );
  }, [category, categories]);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Item name is required');
      return;
    }

    const countNum = parseInt(count, 10);
    if (isNaN(countNum) || countNum < 0) {
      setError('Count must be a non-negative number');
      return;
    }

    const selectedCategory = category.trim() || categories[0];
    onAdd(trimmedName, countNum, selectedCategory);
    resetForm();
    onClose();
  };

  const handleAddNewCategory = () => {
    const trimmedCategory = newCategory.trim();
    if (trimmedCategory) {
      onAddCategory(trimmedCategory);
      setCategory(trimmedCategory);
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const handleCategoryKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNewCategory();
    } else if (e.key === 'Escape') {
      setShowCategoryInput(false);
      setNewCategory('');
    }
  };

  const resetForm = () => {
    setName('');
    setCount('1');
    setCategory(categories[0] || '');
    setShowCategoryInput(false);
    setNewCategory('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-xl"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
            Add New Item
          </h2>
          <button
            onClick={handleClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 rounded-lg" role="alert">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              ref={nameInputRef}
              id="item-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Paper Towels"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="item-count" className="block text-sm font-medium text-gray-700 mb-1">
              Count
            </label>
            <input
              id="item-count"
              type="number"
              min="0"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="item-category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            {showCategoryInput ? (
              <div className="flex gap-2">
                <input
                  ref={categoryInputRef}
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyDown={handleCategoryKeyDown}
                  placeholder="New category name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={handleAddNewCategory}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryInput(false);
                    setNewCategory('');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  id="item-category"
                  type="text"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Select or type category"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="off"
                />
                {showDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {filteredCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => {
                          setCategory(cat);
                          setShowDropdown(false);
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        {cat}
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowCategoryInput(true)}
                      className="w-full px-3 py-2 text-left text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-t border-gray-200"
                    >
                      + Add new category...
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
