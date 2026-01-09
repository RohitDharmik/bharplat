import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../../../types';
import { PriceDisplay } from '../../ui/Controls';
import { useBreakpoint } from '../../../hooks/useResponsive';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
    const { isMobile } = useBreakpoint();

    // Memoize card classes for performance
    const cardClasses = useMemo(() => ({
        container: "relative bg-white dark:bg-neutral-900/60 border border-neutral-200/30 dark:border-white/10 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all duration-200 group cursor-pointer",
        content: "flex items-center justify-between gap-3",
        textContainer: "flex-1 min-w-0",
        header: "flex items-center justify-between gap-2 mb-2",
        nameContainer: "flex items-center gap-2",
        name: "font-bold text-base text-neutral-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors",
        priceContainer: "flex items-center gap-2",
        addButton: "w-8 h-8 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-gold-600 group-hover:to-gold-700 flex-shrink-0",
        plusIcon: "group-active:scale-75 transition-transform"
    }), []);

    // Memoize button click handler for performance
    const handleAddClick = useMemo(() => (e: React.MouseEvent) => {
        e.stopPropagation();
        onAddToCart(item);
    }, [item, onAddToCart]);

    return (
        <div className={cardClasses.container} onClick={() => onAddToCart(item)}>
            <div className={cardClasses.content}>
                <div className={cardClasses.textContainer}>
                    <div className={cardClasses.header}>
                        <div className={cardClasses.nameContainer}>
                            <h3 className={cardClasses.name}>{item.name}</h3>
                        </div>
                        <div className={cardClasses.priceContainer}>
                            <PriceDisplay price={item.price} size={isMobile ? "sm" : "md"} />
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleAddClick}
                    className={cardClasses.addButton}
                >
                    <Plus size={16} className={cardClasses.plusIcon} />
                </button>
            </div>
        </div>
    );
};