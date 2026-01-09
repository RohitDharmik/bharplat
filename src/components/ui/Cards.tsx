import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './Card';

interface DataCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning';
  className?: string;
}

export const DataCard: React.FC<DataCardProps> = ({
  title,
  value,
  trend,
  icon,
  variant = 'default',
  className = ''
}) => {
  const variantClasses = {
    default: 'border-neutral-200 dark:border-white/10 bg-white dark:bg-neutral-900/60',
    primary: 'border-gold-500/20 bg-gradient-to-r from-white to-gold-50/20 dark:from-neutral-900/80 dark:to-gold-900/10',
    success: 'border-green-500/20 bg-green-500/5 dark:bg-green-900/10',
    warning: 'border-yellow-500/20 bg-yellow-500/5 dark:bg-yellow-900/10'
  };

  return (
    <Card className={`${variantClasses[variant]} ${className} hover:shadow-lg transition-shadow duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</CardTitle>
        {icon && <div className="text-gold-600 dark:text-gold-500">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</div>
        {trend && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

interface OrderCardProps {
  orderId: string;
  table: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  status: string;
  createdAt: Date;
  onStatusChange?: (status: string) => void;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  orderId,
  table,
  items,
  total,
  status,
  createdAt,
  onStatusChange,
  onEdit,
  onDelete,
  className = ''
}) => {
  return (
    <Card className={`group ${className} hover:shadow-lg transition-all duration-300`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-neutral-900 dark:text-white">{table}</CardTitle>
            <CardDescription className="text-sm text-neutral-500 dark:text-neutral-400">
              Order #{orderId} • {new Date(createdAt).toLocaleString()}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="font-bold text-gold-600 dark:text-gold-500 text-lg">₹{total.toFixed(2)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === 'READY' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              status === 'SERVED' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              status === 'PAID' ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400' :
              'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
            }`}>
              {status}
            </span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="max-h-32 overflow-y-auto pr-2">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm text-neutral-600 dark:text-neutral-300 border-b border-neutral-100 dark:border-white/5 pb-1 last:border-0 last:pb-0">
              <span>{item.quantity}x {item.name}</span>
              <span>₹{(item.quantity * item.price).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="p-2 text-neutral-500 hover:text-gold-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
        
        {onStatusChange && (
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="text-sm border border-neutral-200 dark:border-white/10 rounded px-2 py-1 bg-white dark:bg-neutral-800"
          >
            <option value="PENDING">Pending</option>
            <option value="PREPARING">Preparing</option>
            <option value="READY">Ready</option>
            <option value="SERVED">Served</option>
            <option value="PAID">Paid</option>
          </select>
        )}
      </CardFooter>
    </Card>
  );
};

interface TableCardProps {
  table: {
    id: string;
    name: string;
    status: string;
    capacity: number;
  };
  onClick?: () => void;
  className?: string;
}

export const TableCard: React.FC<TableCardProps> = ({ table, onClick, className = '' }) => {
  const statusColors = {
    AVAILABLE: 'border-green-500/30 bg-green-500/10 text-green-600 dark:text-green-400',
    OCCUPIED: 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400',
    RESERVED: 'border-gold-500/30 bg-gold-500/10 text-gold-600 dark:text-gold-400',
    DIRTY: 'border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400'
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center h-32 transition-all hover:scale-105 ${
        statusColors[table.status as keyof typeof statusColors] || 'border-neutral-200 dark:border-neutral-700'
      } ${className}`}
    >
      <span className="text-xl font-bold text-neutral-900 dark:text-white">{table.name}</span>
      <span className="text-sm uppercase mt-1 opacity-75">{table.status}</span>
      <span className="text-xs mt-2 text-neutral-600 dark:text-neutral-400">Capacity: {table.capacity}</span>
    </button>
  );
};