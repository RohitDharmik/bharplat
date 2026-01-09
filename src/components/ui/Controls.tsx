import React from 'react';
import { Plus, Minus, Trash2, Edit2 } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove?: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  size = 'md',
  disabled = false
}) => {
  const sizeClasses = {
    sm: {
      container: 'p-1',
      button: 'w-6 h-6',
      icon: 'w-3 h-3',
      text: 'text-xs'
    },
    md: {
      container: 'p-1',
      button: 'w-8 h-8',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    lg: {
      container: 'p-2',
      button: 'w-10 h-10',
      icon: 'w-5 h-5',
      text: 'text-base'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={`flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg ${classes.container} transition-all duration-200 hover:bg-neutral-200 dark:hover:bg-neutral-700`}>
      <button
        onClick={onDecrease}
        disabled={disabled || quantity <= 1}
        className={`flex items-center justify-center rounded ${classes.button} transition-all duration-200 hover:bg-white dark:hover:bg-white/10 ${disabled || quantity <= 1 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
      >
        <Minus className={classes.icon} />
      </button>
      
      <span className={`font-bold text-center w-8 ${classes.text} text-neutral-900 dark:text-white`}>
        {quantity}
      </span>
      
      <button
        onClick={onIncrease}
        disabled={disabled}
        className={`flex items-center justify-center rounded ${classes.button} transition-all duration-200 hover:bg-white dark:hover:bg-white/10 hover:scale-105`}
      >
        <Plus className={classes.icon} />
      </button>
      
      {onRemove && (
        <button
          onClick={onRemove}
          className={`ml-1 flex items-center justify-center rounded ${classes.button} transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-500/10 text-red-500 dark:text-red-400 hover:scale-105`}
        >
          <Trash2 className={classes.icon} />
        </button>
      )}
    </div>
  );
};

interface PriceDisplayProps {
  price: number;
  currency?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  currency = '₹',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg font-semibold'
  };

  return (
    <span className={`font-bold ${sizeClasses[size]} text-gold-600 dark:text-gold-500 ${className}`}>
      {currency}{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
    </span>
  );
};

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  variant = 'default',
  size = 'md'
}) => {
  const variantClasses = {
    default: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm'
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border border-transparent ${variantClasses[variant]} ${sizeClasses[size]} font-medium`}>
      <span className="w-2 h-2 rounded-full bg-current opacity-60"></span>
      <span className="capitalize">{status}</span>
    </span>
  );
};

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  tooltip?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onClick,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  tooltip
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-white/10 hover:bg-neutral-50 dark:hover:bg-neutral-700',
    primary: 'bg-gold-500 text-black hover:bg-gold-400 shadow-lg shadow-gold-500/20',
    secondary: 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600'
  };

  const sizeClasses = {
    sm: 'w-8 h-8 p-1',
    md: 'w-10 h-10 p-2',
    lg: 'w-12 h-12 p-3'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center rounded-lg transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
      title={tooltip}
    >
      {icon}
    </button>
  );
};