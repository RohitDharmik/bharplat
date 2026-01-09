import React from 'react';

export const LoadingSpinner: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-neutral-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
            <div className="text-center space-y-4">
                <div className="relative">
                    <div className="absolute -inset-4 bg-gold-500/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10 mx-auto w-fit">
                        <div className="w-12 h-12 border-4 border-gold-200 border-t-gold-600 rounded-full animate-spin"></div>
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">Loading Menu</h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">Please wait while we prepare your dining experience</p>
                </div>
            </div>
        </div>
    );
};