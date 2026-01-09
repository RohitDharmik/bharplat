import React from 'react';
import { Soup, Pizza, Cake, Wine, Utensils } from 'lucide-react';

interface CategoryHeaderProps {
    category: string;
    isActive: boolean;
}

export const CategoryHeader: React.FC<CategoryHeaderProps> = ({ category, isActive }) => {
    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Starter': return Soup;
            case 'Main': return Pizza;
            case 'Dessert': return Cake;
            case 'Drink': return Wine;
            default: return Utensils;
        }
    };

    const IconComponent = getCategoryIcon(category);

    return (
        <div className="flex items-center gap-4 p-1">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 dark:from-gold-900/30 dark:to-gold-800/30 flex items-center justify-center transition-all duration-300 ${
                isActive 
                    ? 'scale-110 shadow-lg shadow-gold-500/30 ring-2 ring-gold-400/50' 
                    : 'shadow-md'
            }`}>
                <IconComponent 
                    size={18}
                    className={`transition-all duration-300 ${
                        isActive ? 'text-gold-700 scale-110' : 'text-gold-600'
                    }`}
                />
            </div>
            <div className="flex flex-col gap-2">
                <h3 className={`text-xl font-bold transition-all duration-300 ${
                    isActive ? 'text-gold-600 dark:text-gold-500 scale-105' : 'text-neutral-900 dark:text-white'
                }`}>
                    {category}
                </h3>
                <div className={`w-4 h-1 rounded-full transition-all duration-300 ${
                    isActive ? 'bg-gold-500 animate-pulse' : 'bg-neutral-300 dark:bg-neutral-600'
                }`}></div>
            </div>
        </div>
    );
};