import React, { useMemo } from 'react';
import { useBreakpoint } from '../../../hooks/useResponsive';

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
    const { isMobile } = useBreakpoint();

    // Memoize tab styles for performance
    const tabStyles = useMemo(() => ({
        base: 'px-3 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
        active: 'bg-gold-500 text-black shadow-lg shadow-gold-500/20 ring-2 ring-gold-300/50 scale-105',
        inactive: 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border border-transparent dark:border-white/10 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
    }), []);

    // Memoize tab style classes
    const getTabClassName = useMemo(() => (category: string) => 
        `${tabStyles.base} ${activeCategory === category ? tabStyles.active : tabStyles.inactive}`,
        [activeCategory, tabStyles]
    );

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar sticky top-0 bg-white dark:bg-[#0a0a0a] z-20 pt-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => onCategoryChange(cat)}
                    className={getTabClassName(cat)}
                    style={{
                        minWidth: isMobile ? 'auto' : '80px'
                    }}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};