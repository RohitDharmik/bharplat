import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import { QrCode } from 'lucide-react';

export const GuestTableSelection: React.FC = () => {
    const { tables, setGuestTableId } = useAppStore();
    const [scanning, setScanning] = useState(false);

    const handleTableSelect = (tableId: string) => {
        setScanning(true);
        // Simulate scanning delay
        setTimeout(() => {
            setGuestTableId(tableId);
            setScanning(false);
        }, 800);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="relative">
                <div className="absolute -inset-4 bg-gold-500/20 rounded-full blur-xl animate-pulse"></div>
                <div className="relative bg-white dark:bg-neutral-800 p-6 rounded-3xl shadow-2xl border border-neutral-200 dark:border-white/10">
                    <QrCode size={80} className="text-gold-600 dark:text-gold-500" />
                </div>
            </div>
            
            <div className="space-y-2 max-w-md">
                <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">Welcome to bharplate</h2>
                <p className="text-neutral-500 dark:text-neutral-400">Scan the QR code on your table or select your table number below to view the menu.</p>
            </div>

            {scanning ? (
                <div className="flex flex-col items-center gap-3 text-gold-500">
                    <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    <span>Connecting to table...</span>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-lg px-4">
                    {tables.map(table => (
                        <button
                            key={table.id}
                            onClick={() => handleTableSelect(table.id)}
                            className="p-3 rounded-xl border border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900 hover:border-gold-500 hover:text-gold-500 dark:hover:text-gold-400 transition-all font-medium text-neutral-700 dark:text-neutral-300 shadow-sm"
                        >
                            {table.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};