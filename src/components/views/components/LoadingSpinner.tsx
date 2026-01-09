import React, { useMemo } from 'react';
import { useBreakpoint } from '../../../hooks/useResponsive';

interface LoadingSpinnerProps {
    height?: string | number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
    height = '100vh', 
    size = 'md',
    message = 'Loading...'
}) => {
    const { isMobile } = useBreakpoint();
    
    // Memoize size classes for performance
    const sizeClasses = useMemo(() => ({
        sm: 'w-6 h-6',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16'
    }), []);

    return (
        <div 
            className="flex flex-col items-center justify-center animate-in fade-in duration-300"
            style={{ minHeight: height }}
        >
            <div className="relative">
                <div className="absolute -inset-4 bg-gold-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white dark:bg-neutral-800 p-4 rounded-2xl shadow-2xl border border-neutral-200 dark:border-white/10">
                    <div className={`border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin ${sizeClasses[size]}`}></div>
                </div>
            </div>
            
            <div className="mt-4 text-center space-y-2">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">{message}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Please wait while we prepare your experience
                </p>
            </div>
        </div>
    );
};