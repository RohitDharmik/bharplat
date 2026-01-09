import React from 'react';
import { Plus } from 'lucide-react';

interface CartButtonProps {
    itemCount: number;
    total: number;
    onOpenCart: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ itemCount, total, onOpenCart }) => {
    return (
        <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-96 z-40">
            <button 
                onClick={onOpenCart}
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black p-4 rounded-2xl shadow-2xl flex justify-between items-center font-bold text-lg animate-in slide-in-from-bottom-4 hover:shadow-3xl transition-shadow"
            >
                <div className="flex items-center gap-3">
                    <div className="bg-gold-500 text-black w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                        {itemCount}
                    </div>
                    <span className="text-base">View Order</span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-lg font-bold">₹{total.toFixed(2)}</span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-600">Total</span>
                </div>
            </button>
        </div>
    );
};