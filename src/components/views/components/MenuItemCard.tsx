import React from 'react';
import { Plus } from 'lucide-react';
import { MenuItem } from '../../../types';

interface MenuItemCardProps {
    item: MenuItem;
    onAddToCart: (item: MenuItem) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToCart }) => {
    return (
        <div className="bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-900/80 dark:to-neutral-800/60 border border-neutral-200/50 dark:border-white/10 p-4 rounded-2xl flex gap-4 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-2 hover:border-gold-400/80 dark:hover:border-gold-400/60 hover:scale-[1.02] group cursor-pointer" onClick={() => onAddToCart(item)}>
            <div className="relative flex-shrink-0">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-24 h-24 rounded-xl object-cover bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 shadow-md group-hover:shadow-xl transition-shadow duration-300"
                    />
                ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 shadow-md group-hover:shadow-xl transition-shadow duration-300 flex items-center justify-center text-4xl font-bold text-neutral-600 dark:text-neutral-300 border-2 border-neutral-200/50 dark:border-white/20">
                        {item.name.charAt(0).toUpperCase()}
                    </div>
                )}
                
            </div>
            <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg text-neutral-900 dark:text-white group-hover:text-gold-600 dark:group-hover:text-gold-400 transition-colors">{item.name}</h3>
                        <span className="px-2 py-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-xs rounded-full font-medium border border-gold-500/20">{item.category}</span>
                    </div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">{item.description}</p>
                </div>
                <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-2xl text-gold-600 dark:text-gold-500">₹{item.price}</span>
                        {item.price > 200 && (
                            <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-xs rounded-full font-medium border border-green-500/20">Popular</span>
                        )}
                    </div>
                    <button
                        onClick={() => onAddToCart(item)}
                        className="w-10 h-10 bg-gradient-to-r from-gold-500 to-gold-600 text-black font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-gold-600 group-hover:to-gold-700"
                    >
                        <Plus size={20} className="group-active:scale-75 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};