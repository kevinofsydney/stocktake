export const STORAGE_KEYS = {
  ITEMS: 'stocktake_items',
  CATEGORIES: 'stocktake_categories',
} as const;

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
