import React from 'react';
import QRCode from 'react-qr-code';
import { useAppStore } from '../../store/useAppStore';
import { Printer, Download, MapPin } from 'lucide-react';
import { Button } from 'antd';

  const QRCodeManagerView: React.FC = () => {
    const { tables } = useAppStore();

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center no-print">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">QR Code Management</h2>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm">Generate and print digital menu QR codes for tables and areas.</p>
                </div>
                <Button onClick={handlePrint} icon={<Printer size={16} />} type="primary" className="bg-gold-500 text-black border-none flex items-center">
                    Print All
                </Button>
            </div>

            {/* General Outlet QR */}
            <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 rounded-xl p-8 text-center shadow-sm">
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">Master Outlet QR</h3>
                <div className="flex flex-col items-center">
                    <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-lg">
                        <QRCode value="https://bharplate.com/outlet/demo" size={180} />
                    </div>
                    <p className="mt-4 font-mono text-sm text-neutral-500">https://bharplate.com/outlet/demo</p>
                    <div className="mt-4 flex gap-3 no-print">
                        <Button icon={<Download size={14} />}>Download PNG</Button>
                        <Button icon={<Download size={14} />}>Download SVG</Button>
                    </div>
                </div>
            </div>

            {/* Table QR Codes */}
            <div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-gold-500" />
                    Table Specific QR Codes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {tables.map(table => (
                        <div key={table.id} className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/5 p-6 rounded-xl flex flex-col items-center text-center group hover:border-gold-500/30 transition-all">
                             <div className="p-2 bg-white rounded-lg mb-4">
                                <QRCode value={`https://bharplate.com/outlet/demo/table/${table.id}`} size={120} />
                             </div>
                             <h4 className="font-bold text-neutral-900 dark:text-white text-lg">{table.name}</h4>
                             <p className="text-xs text-neutral-500 uppercase tracking-wide mb-3">{table.zone}</p>
                             <Button size="small" className="opacity-0 group-hover:opacity-100 transition-opacity no-print">Download</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
export default QRCodeManagerView;