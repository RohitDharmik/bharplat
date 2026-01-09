import React, { useMemo } from 'react';
import { Collapse } from 'antd';
import { MenuItem } from '../../../types';
import { MenuItemCard } from './MenuItemCard';
import { CategoryHeader } from './CategoryHeader';
import { useGroupedData } from '../../../hooks/useMemoizedData';
import './GuestPortal.scss';

interface CategoryAccordionProps {
    categories: string[];
    menu: MenuItem[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    onAddToCart: (item: MenuItem) => void;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
    categories,
    menu,
    activeCategory,
    onCategoryChange,
    onAddToCart
}) => {
    const { Panel } = Collapse;

    // Memoize grouped menu data for performance
    const groupedMenu = useGroupedData(
        menu,
        (item) => item.category,
        [menu]
    );

    // Filter categories to exclude 'All'
    const displayCategories = useMemo(() => 
        categories.filter(cat => cat !== 'All'), 
        [categories]
    );

    return (
        <div className="max-h-[100vh] overflow-y-auto pr-2 custom-scrollbar">
            <Collapse
                accordion
                defaultActiveKey={categories[1]} // Open first category by default (Starter)
                activeKey={activeCategory === 'All' ? categories[1] : activeCategory}
                onChange={(key) => {
                    if (Array.isArray(key) && key.length > 0) {
                        onCategoryChange(key[0]);
                    } else {
                        onCategoryChange(categories[1]);
                    }
                }}
                className="bg-transparent border-none"
                expandIcon={() => null} // Hide the expand icon
                ghost // Remove default panel styling
            >
                {displayCategories.map(category => {
                    const categoryItems = groupedMenu[category] || [];
                    
                    if (categoryItems.length === 0) return null;

                    return (
                        <Panel
                            key={category}
                            header={
                                <div className="flex items-center justify-between w-full">
                                    <CategoryHeader category={category} isActive={activeCategory === category} />
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                                        activeCategory === category
                                            ? 'border-gold-500 bg-gold-500 text-black shadow-lg shadow-gold-500/30'
                                            : 'border-neutral-300 dark:border-white/50 text-neutral-500 dark:text-neutral-400'
                                    }`}>
                                        {activeCategory === category ? '−' : '+'}
                                    </div>
                                </div>
                            }
                            className={`border-0 rounded-xl mb-4 overflow-hidden transition-all duration-300 ${
                                activeCategory === category
                                    ? 'ring-2 ring-gold-500/20 bg-gradient-to-r from-white to-gold-50/20 dark:from-neutral-900/80 dark:to-gold-900/10'
                                    : 'bg-white dark:bg-neutral-900/60 hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                            }`}
                        >
                            {/* Category Items Grid */}
                            <div className="grid grid-cols-1 gap-2 p-2">
                                {categoryItems.map(item => (
                                    <MenuItemCard key={item.id} item={item} onAddToCart={onAddToCart} />
                                ))}
                            </div>
                        </Panel>
                    );
                })}
            </Collapse>
        </div>
    );
};
