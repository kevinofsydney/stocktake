import { useState, useRef, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import type { Item } from '../types';

interface InventoryItemProps {
  item: Item;
  onUpdateCount: (id: string, count: number) => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void;
}

export function InventoryItem({
  item,
  onUpdateCount,
  onIncrement,
  onDecrement,
  onDelete,
}: InventoryItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(item.count));
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleCountClick = () => {
    setEditValue(String(item.count));
    setIsEditing(true);
  };

  const handleSave = () => {
    const newCount = parseInt(editValue, 10);
    if (!isNaN(newCount) && newCount >= 0) {
      onUpdateCount(item.id, newCount);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(String(item.count));
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const handleDeleteClick = () => {
    if (showDeleteConfirm) {
      onDelete(item.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  const getStockLevelClass = () => {
    if (item.count === 0) return 'bg-red-50 border-red-200';
    if (item.count <= 2) return 'bg-amber-50 border-amber-200';
    return 'bg-white border-gray-200';
  };

  const getCountBadgeClass = () => {
    if (item.count === 0) return 'bg-red-100 text-red-800';
    if (item.count <= 2) return 'bg-amber-100 text-amber-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <>
      {/* Desktop row view */}
      <tr className={`hidden sm:table-row border-b ${getStockLevelClass()}`}>
        <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
        <td className="px-4 py-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {item.category}
          </span>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDecrement(item.id)}
              disabled={item.count === 0}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Decrease ${item.name} count`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            {isEditing ? (
              <input
                ref={inputRef}
                type="number"
                min="0"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-16 px-2 py-1 text-center border border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={`Edit ${item.name} count`}
              />
            ) : (
              <button
                onClick={handleCountClick}
                className={`min-w-[3rem] px-3 py-1 text-center rounded-md font-medium cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all ${getCountBadgeClass()}`}
                aria-label={`${item.name} count: ${item.count}. Click to edit.`}
              >
                {item.count}
              </button>
            )}

            <button
              onClick={() => onIncrement(item.id)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Increase ${item.name} count`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </td>
        <td className="px-4 py-3">
          <button
            onClick={handleDeleteClick}
            className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
              showDeleteConfirm
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
            aria-label={showDeleteConfirm ? `Confirm delete ${item.name}` : `Delete ${item.name}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </td>
      </tr>

      {/* Mobile card view */}
      <div className={`sm:hidden p-4 rounded-lg border ${getStockLevelClass()}`}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-medium text-gray-900">{item.name}</h3>
            <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {item.category}
            </span>
          </div>
          <button
            onClick={handleDeleteClick}
            className={`p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 ${
              showDeleteConfirm
                ? 'bg-red-600 text-white'
                : 'text-gray-400 hover:text-red-600'
            }`}
            aria-label={showDeleteConfirm ? `Confirm delete ${item.name}` : `Delete ${item.name}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => onDecrement(item.id)}
            disabled={item.count === 0}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Decrease ${item.name} count`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {isEditing ? (
            <input
              ref={inputRef}
              type="number"
              min="0"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleSave}
              onKeyDown={handleKeyDown}
              className="w-20 px-3 py-2 text-center text-xl font-semibold border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Edit ${item.name} count`}
            />
          ) : (
            <button
              onClick={handleCountClick}
              className={`min-w-[4rem] px-4 py-2 text-center text-xl font-semibold rounded-lg cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all ${getCountBadgeClass()}`}
              aria-label={`${item.name} count: ${item.count}. Click to edit.`}
            >
              {item.count}
            </button>
          )}

          <button
            onClick={() => onIncrement(item.id)}
            className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Increase ${item.name} count`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
