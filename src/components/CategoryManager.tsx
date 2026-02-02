import { useState, useRef, useEffect } from 'react';
import type { Category } from '../types';

interface CategoryManagerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  itemCounts: Record<string, number>;
  onUpdateCategory: (id: string, newName: string) => boolean;
  onDeleteCategory: (id: string, reassignTo?: string) => boolean;
  onAddCategory: (name: string) => Category | null;
}

export function CategoryManager({
  isOpen,
  onClose,
  categories,
  itemCounts,
  onUpdateCategory,
  onDeleteCategory,
  onAddCategory,
}: CategoryManagerProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [reassignCategory, setReassignCategory] = useState<string>('');
  const [error, setError] = useState('');

  const modalRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingId]);

  useEffect(() => {
    const handleEscape = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (editingId) {
          setEditingId(null);
          setEditValue('');
        } else if (deleteConfirm) {
          setDeleteConfirm(null);
          setReassignCategory('');
        } else {
          onClose();
        }
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
  }, [isOpen, onClose, editingId, deleteConfirm]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setEditValue(category.name);
    setError('');
  };

  const saveEdit = () => {
    if (!editingId) return;

    const success = onUpdateCategory(editingId, editValue);
    if (success) {
      setEditingId(null);
      setEditValue('');
      setError('');
    } else {
      setError('Category name already exists or is invalid');
    }
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditValue('');
      setError('');
    }
  };

  const confirmDelete = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    const count = category ? itemCounts[category.name] || 0 : 0;

    if (count > 0) {
      setDeleteConfirm(categoryId);
      const otherCategories = categories.filter((c) => c.id !== categoryId);
      setReassignCategory(otherCategories[0]?.name || '');
    } else {
      onDeleteCategory(categoryId);
    }
  };

  const executeDelete = () => {
    if (!deleteConfirm) return;

    onDeleteCategory(deleteConfirm, reassignCategory || undefined);
    setDeleteConfirm(null);
    setReassignCategory('');
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) return;

    const result = onAddCategory(trimmed);
    if (result) {
      setNewCategoryName('');
      setError('');
    } else {
      setError('Category already exists');
    }
  };

  if (!isOpen) return null;

  const categoryToDelete = categories.find((c) => c.id === deleteConfirm);
  const itemsInDeleteCategory = categoryToDelete ? itemCounts[categoryToDelete.name] || 0 : 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-modal-title"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[80vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="category-modal-title" className="text-lg font-semibold text-gray-900">
            Manage Categories
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 text-sm text-red-700 bg-red-50 rounded-lg" role="alert">
            {error}
          </div>
        )}

        {deleteConfirm && categoryToDelete && (
          <div className="mx-4 mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 font-medium mb-3">
              "{categoryToDelete.name}" has {itemsInDeleteCategory} item{itemsInDeleteCategory !== 1 ? 's' : ''}.
              What would you like to do with them?
            </p>
            <div className="space-y-2">
              <label className="block text-sm text-gray-700">
                Move items to:
              </label>
              <select
                value={reassignCategory}
                onChange={(e) => setReassignCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories
                  .filter((c) => c.id !== deleteConfirm)
                  .map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => {
                  setDeleteConfirm(null);
                  setReassignCategory('');
                }}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Move & Delete
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {categories.map((category) => {
              const count = itemCounts[category.name] || 0;
              const isEditing = editingId === category.id;

              return (
                <li
                  key={category.id}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  {isEditing ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleEditKeyDown}
                      onBlur={() => {
                        if (editValue.trim() === categories.find(c => c.id === editingId)?.name) {
                          setEditingId(null);
                          setEditValue('');
                        }
                      }}
                      className="flex-1 px-2 py-1 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span className="flex-1 text-gray-900">{category.name}</span>
                  )}

                  <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                    {count} item{count !== 1 ? 's' : ''}
                  </span>

                  {isEditing ? (
                    <>
                      <button
                        onClick={saveEdit}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded"
                        aria-label="Save"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditValue('');
                          setError('');
                        }}
                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
                        aria-label="Cancel"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(category)}
                        className="p-1.5 text-gray-500 hover:bg-gray-200 rounded"
                        aria-label={`Edit ${category.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => confirmDelete(category.id)}
                        className="p-1.5 text-red-500 hover:bg-red-100 rounded"
                        aria-label={`Delete ${category.name}`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              placeholder="New category name"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
