import React, { useMemo } from 'react';
import { Soup, Pizza, Cake, Wine, Utensils } from 'lucide-react';
import { useBreakpoint } from '../../../hooks/useResponsive';

interface CategoryHeaderProps {
    category: string;
    isActive: boolean;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, isActive }) => {
    const { isMobile } = useBreakpoint();
    
    // Memoize icon selection for performance
    const IconComponent = useMemo(() => {
        switch (category) {
            case 'Starter': return Soup;
            case 'Main': return Pizza;
            case 'Dessert': return Cake;
            case 'Drink': return Wine;
            default: return Utensils;
        }
    }, [category]);

    // Memoize icon size for performance
    const iconSize = useMemo(() => isMobile ? 16 : 18, [isMobile]);

    // Memoize header classes for performance
    const headerClasses = useMemo(() => ({
        container: "flex items-center gap-3 p-1",
        iconContainer: `w-8 h-8 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900/30 dark:to-gold-800/30 flex items-center justify-center transition-all duration-300 ${
            isActive 
                ? 'scale-110 shadow-lg shadow-gold-500/30 ring-2 ring-gold-400/50' 
                : 'shadow-md'
        }`,
        icon: `transition-all duration-300 ${
            isActive ? 'text-gold-700 scale-110' : 'text-gold-600'
        }`,
        textContainer: "flex flex-col gap-1",
        title: `text-lg font-bold transition-all duration-300 ${
            isActive ? 'text-gold-600 dark:text-gold-500 scale-105' : 'text-neutral-900 dark:text-white'
        }`,
        indicator: `w-3 h-1 rounded-full transition-all duration-300 ${
            isActive ? 'bg-gold-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-600'
        }`
    }), [isActive]);

    return (
        <div className={headerClasses.container}>
            <div className={headerClasses.iconContainer}>
                <IconComponent size={iconSize} className={headerClasses.icon} />
            </div>
            <div className={headerClasses.textContainer}>
                <h3 className={headerClasses.title}>
                    {category}
                </h3>
                <div className={headerClasses.indicator}></div>
            </div>
        </div>
    );
};