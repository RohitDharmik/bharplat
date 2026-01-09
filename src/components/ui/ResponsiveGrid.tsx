import React from 'react';
import { useBreakpoint } from '../../hooks/useResponsive';

interface ResponsiveGridProps {
  children: React.ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    largeDesktop?: number;
  };
  gap?: string;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3, largeDesktop: 4 },
  gap = '4',
  className = ''
}) => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useBreakpoint();
  
  const getGridColumns = () => {
    if (isLargeDesktop && columns.largeDesktop) return columns.largeDesktop;
    if (isDesktop && columns.desktop) return columns.desktop;
    if (isTablet && columns.tablet) return columns.tablet;
    if (isMobile && columns.mobile) return columns.mobile;
    return 1; // fallback
  };

  const gridCols = getGridColumns();
  const gapClass = `gap-${gap}`;

  return (
    <div className={`grid grid-cols-${gridCols} ${gapClass} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | 'none';
  padding?: boolean;
  className?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  maxWidth = '4xl',
  padding = true,
  className = ''
}) => {
  const maxWidthClass = maxWidth === 'none' ? '' : `max-w-${maxWidth}`;
  const paddingClass = padding ? 'px-4 sm:px-6 lg:px-8' : '';
  
  return (
    <div className={`mx-auto ${maxWidthClass} ${paddingClass} ${className}`}>
      {children}
    </div>
  );
};

interface ResponsiveStackProps {
  children: React.ReactNode;
  direction?: 'vertical' | 'horizontal';
  gap?: string;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  className?: string;
}

export const ResponsiveStack: React.FC<ResponsiveStackProps> = ({
  children,
  direction = 'vertical',
  gap = '4',
  align = 'stretch',
  justify = 'start',
  className = ''
}) => {
  const directionClass = direction === 'horizontal' ? 'flex' : 'flex flex-col';
  const gapClass = `gap-${gap}`;
  const alignClass = `items-${align}`;
  const justifyClass = direction === 'horizontal' ? `justify-${justify}` : '';
  
  return (
    <div className={`${directionClass} ${gapClass} ${alignClass} ${justifyClass} ${className}`}>
      {children}
    </div>
  );
};