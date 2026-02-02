export interface Item {
  id: string;
  name: string;
  count: number;
  category: string;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  isDefault: boolean;
}

export const DEFAULT_CATEGORIES = [
  'Laundry',
  'Electronics',
  'Pantry',
  'Bathroom',
  'Cleaning',
  'Office',
  'Kitchen',
  'Other',
] as const;

export type DefaultCategory = (typeof DEFAULT_CATEGORIES)[number];
