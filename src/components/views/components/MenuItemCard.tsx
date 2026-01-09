import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../../../types';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
    return (
        <div className="relative bg-white dark:bg-neutral-900/60 border border-neutral-200/30 dark:border-white/10 p-2 sm:p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-all duration-200 group cursor-pointer" onClick={() => onAddToCart(item)}>
            <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 sm:gap-2 mb-1">
                        <div className="flex items-center gap-1 sm:gap-2">
                            <h3 className="font-bold text-sm sm:text-base text-neutral-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{item.name}</h3>
                            {/* <span className="px-1 py-0.5 sm:px-2 sm:py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs rounded-full font-medium border border-gold-500/20 whitespace-nowrap text-xs">{item.category}</span> */}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2">
                            <span className="font-bold text-base sm:text-lg text-gold-600 dark:text-gold-500">₹{item.price}</span>
                            {/* {item.price > 200 && (
                                <span className="absolute top-1 px-1 py-0.5 sm:px-2 sm:py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full font-medium border border-green-500/20 whitespace-nowrap">Popular</span>
                            )} */}
                        </div>
                    </div>
                    {/* <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">{item.description}</p> */}
                </div>
                <button
                    onClick={() => onAddToCart(item)}
                    className="w-5 h-5 sm:w-8 sm:h-8 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-gold-600 group-hover:to-gold-700 flex-shrink-0"
                >
                    <Plus size={14} className="sm:size-18 group-active:scale-75 transition-transform" />
                </button>
            </div>
        </div>
    );
};