import React, { useMemo } from 'react';
import { useBreakpoint } from '../../../hooks/useResponsive';
import { PriceDisplay } from '../../ui/Controls';

interface CartButtonProps {
    itemCount: number;
    total: number;
    onOpenCart: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ itemCount, total, onOpenCart }) => {
    const { isMobile, isTablet } = useBreakpoint();

    // Memoize button position classes for performance
    const positionClasses = useMemo(() => 
        isMobile || isTablet 
            ? 'left-6 right-6' 
            : 'right-6 w-96',
        [isMobile, isTablet]
    );

    // Memoize button content for performance
    const buttonContent = useMemo(() => (
        <>
            <div className="flex items-center gap-3">
                <div className="bg-gold-500 text-black w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {itemCount}
                </div>
                <span className="text-base">View Order</span>
            </div>
            <div className="flex flex-col items-end">
                <PriceDisplay price={total} size="lg" />
                <span className="text-xs text-neutral-400 dark:text-neutral-600">Total</span>
            </div>
        </>
    ), [itemCount, total]);

    return (
        <div className={`fixed bottom-6 ${positionClasses} z-40`}>
            <button 
                onClick={onOpenCart}
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-3 px-4 rounded-2xl shadow-2xl flex justify-between items-center font-bold text-lg animate-in slide-in-from-bottom-4 hover:shadow-3xl transition-shadow"
            >
                {buttonContent}
            </button>
        </div>
    );
};