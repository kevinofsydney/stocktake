interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
  itemCounts: Record<string, number>;
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
  itemCounts,
}: CategoryFilterProps) {
  const totalCount = Object.values(itemCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="w-full">
      {/* Desktop horizontal button group */}
      <div className="hidden sm:flex flex-wrap gap-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            selectedCategory === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          aria-pressed={selectedCategory === null}
        >
          All ({totalCount})
        </button>
        {categories.map((category) => {
          const count = itemCounts[category] || 0;
          if (count === 0) return null;
          return (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={selectedCategory === category}
            >
              {category} ({count})
            </button>
          );
        })}
      </div>

      {/* Mobile dropdown */}
      <div className="sm:hidden">
        <label htmlFor="category-filter" className="sr-only">
          Filter by category
        </label>
        <select
          id="category-filter"
          value={selectedCategory || ''}
          onChange={(e) => onSelectCategory(e.target.value || null)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories ({totalCount})</option>
          {categories.map((category) => {
            const count = itemCounts[category] || 0;
            if (count === 0) return null;
            return (
              <option key={category} value={category}>
                {category} ({count})
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
