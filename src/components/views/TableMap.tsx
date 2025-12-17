import React from 'react';
import { Table, TableStatus } from '../../types';
import { Users, Clock, AlertCircle } from 'lucide-react';

interface TableMapProps {
  tables: Table[];
  onTableClick: (table: Table) => void;
}

const getStatusColor = (status: TableStatus) => {
  switch (status) {
    case TableStatus.AVAILABLE: return 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20';
    case TableStatus.OCCUPIED: return 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20';
    case TableStatus.RESERVED: return 'border-gold-500/30 bg-gold-500/10 text-gold-400 hover:bg-gold-500/20';
    case TableStatus.DIRTY: return 'border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20';
    default: return 'border-neutral-700 bg-neutral-800';
  }
};

export const TableMap: React.FC<TableMapProps> = ({ tables, onTableClick }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tables.map((table) => (
        <button
          key={table.id}
          onClick={() => onTableClick(table)}
          className={`
            relative h-40 rounded-2xl border-2 backdrop-blur-md transition-all duration-300
            flex flex-col items-center justify-center p-4 group
            ${getStatusColor(table.status)}
          `}
        >
          <div className="absolute top-3 right-3 opacity-60">
             {table.status === TableStatus.RESERVED && <Clock size={16} />}
             {table.status === TableStatus.DIRTY && <AlertCircle size={16} />}
          </div>
          
          <div className="text-2xl font-bold mb-2">{table.name}</div>
          
          <div className="flex items-center space-x-2 text-sm opacity-80">
            <Users size={14} />
            <span>{table.capacity} Seats</span>
          </div>

          <div className="mt-3 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-black/20">
            {table.status}
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-medium text-sm">Manage Table</span>
          </div>
        </button>
      ))}
    </div>
  );
};