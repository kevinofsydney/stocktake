import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Item, Category } from '../types';
import { DEFAULT_CATEGORIES } from '../types';
import { STORAGE_KEYS, generateId } from '../utils/storage';

const initialCategories: Category[] = DEFAULT_CATEGORIES.map((name) => ({
  id: generateId(),
  name,
  isDefault: true,
}));

export function useInventory() {
  const [items, setItems] = useLocalStorage<Item[]>(STORAGE_KEYS.ITEMS, []);
  const [categories, setCategories] = useLocalStorage<Category[]>(
    STORAGE_KEYS.CATEGORIES,
    initialCategories
  );

  const addItem = useCallback(
    (name: string, count: number, category: string) => {
      const now = Date.now();
      const newItem: Item = {
        id: generateId(),
        name: name.trim(),
        count: Math.max(0, count),
        category,
        createdAt: now,
        updatedAt: now,
      };
      setItems((prev) => [...prev, newItem]);
      return newItem;
    },
    [setItems]
  );

  const updateItem = useCallback(
    (id: string, updates: Partial<Pick<Item, 'name' | 'count' | 'category'>>) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...updates,
                count:
                  updates.count !== undefined
                    ? Math.max(0, updates.count)
                    : item.count,
                updatedAt: Date.now(),
              }
            : item
        )
      );
    },
    [setItems]
  );

  const deleteItem = useCallback(
    (id: string) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems]
  );

  const incrementCount = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, count: item.count + 1, updatedAt: Date.now() }
            : item
        )
      );
    },
    [setItems]
  );

  const decrementCount = useCallback(
    (id: string) => {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, count: Math.max(0, item.count - 1), updatedAt: Date.now() }
            : item
        )
      );
    },
    [setItems]
  );

  const addCategory = useCallback(
    (name: string) => {
      const trimmedName = name.trim();
      const exists = categories.some(
        (cat) => cat.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (exists || !trimmedName) return null;

      const newCategory: Category = {
        id: generateId(),
        name: trimmedName,
        isDefault: false,
      };
      setCategories((prev) => [...prev, newCategory]);
      return newCategory;
    },
    [categories, setCategories]
  );

  const updateCategory = useCallback(
    (id: string, newName: string) => {
      const trimmedName = newName.trim();
      if (!trimmedName) return false;

      const exists = categories.some(
        (cat) => cat.id !== id && cat.name.toLowerCase() === trimmedName.toLowerCase()
      );
      if (exists) return false;

      const oldCategory = categories.find((cat) => cat.id === id);
      if (!oldCategory) return false;

      // Update category name
      setCategories((prev) =>
        prev.map((cat) => (cat.id === id ? { ...cat, name: trimmedName } : cat))
      );

      // Update all items with the old category name
      setItems((prev) =>
        prev.map((item) =>
          item.category === oldCategory.name
            ? { ...item, category: trimmedName, updatedAt: Date.now() }
            : item
        )
      );

      return true;
    },
    [categories, setCategories, setItems]
  );

  const deleteCategory = useCallback(
    (id: string, reassignTo?: string) => {
      const categoryToDelete = categories.find((cat) => cat.id === id);
      if (!categoryToDelete) return false;

      // If there are items in this category, reassign them
      if (reassignTo) {
        setItems((prev) =>
          prev.map((item) =>
            item.category === categoryToDelete.name
              ? { ...item, category: reassignTo, updatedAt: Date.now() }
              : item
          )
        );
      } else {
        // Delete items in this category if no reassignment
        setItems((prev) =>
          prev.filter((item) => item.category !== categoryToDelete.name)
        );
      }

      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      return true;
    },
    [categories, setCategories, setItems]
  );

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => b.updatedAt - a.updatedAt),
    [items]
  );

  const categoryNames = useMemo(
    () => categories.map((cat) => cat.name),
    [categories]
  );

  return {
    items: sortedItems,
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
  };
}
