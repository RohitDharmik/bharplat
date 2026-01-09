import React, { Suspense } from 'react';
import { LazyLoader as BaseLazyLoader, LoadingSpinner } from './SuspenseWrapper';

interface LazyLoaderProps {
  children: React.ReactNode;
  minHeight?: string | number;
  className?: string;
  fallback?: React.ReactNode;
}

export const LazyLoader: React.FC<LazyLoaderProps> = ({ 
  children, 
  minHeight = '400px',
  className = '',
  fallback
}) => {
  return (
    <Suspense fallback={fallback || <LoadingSpinner height={minHeight} />}>
      <div className={className}>
        {children}
      </div>
    </Suspense>
  );
};

// Lazy load components with proper error boundaries
export const lazyLoad = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
) => {
  const LazyComponent = React.lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <LazyComponent {...props} />
    </Suspense>
  );
};