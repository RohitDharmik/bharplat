import React from 'react';

interface CategoryTabsProps {
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
    categories,
    activeCategory,
    onCategoryChange
}) => {
    return (
        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar mb-4 sticky top-0 bg-white dark:bg-[#0a0a0a] z-20 pt-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat
                        ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20 ring-2 ring-gold-300/50 scale-105'
                        : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-transparent dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};