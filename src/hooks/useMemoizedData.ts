import { useMemo } from 'react';

// Hook for memoizing expensive calculations
export const useMemoizedData = <T>(
  data: T[],
  dependencies: any[],
  calculateFn: (data: T[]) => any
) => {
  return useMemo(() => calculateFn(data), dependencies);
};

// Hook for memoizing filtered data
export const useFilteredData = <T>(
  data: T[],
  filterFn: (item: T) => boolean,
  dependencies: any[] = []
) => {
  return useMemo(() => data.filter(filterFn), [data, ...dependencies]);
};

// Hook for memoizing sorted data
export const useSortedData = <T>(
  data: T[],
  sortFn: (a: T, b: T) => number,
  dependencies: any[] = []
) => {
  return useMemo(() => [...data].sort(sortFn), [data, ...dependencies]);
};

// Hook for memoizing grouped data
export const useGroupedData = <T, K extends string | number | symbol>(
  data: T[],
  groupByFn: (item: T) => K,
  dependencies: any[] = []
) => {
  return useMemo(() => {
    return data.reduce((groups, item) => {
      const key = groupByFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    }, {} as Record<K, T[]>);
  }, [data, ...dependencies]);
};

// Hook for memoizing paginated data
export const usePaginatedData = <T>(
  data: T[],
  page: number,
  pageSize: number,
  dependencies: any[] = []
) => {
  return useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return {
      data: data.slice(startIndex, endIndex),
      total: data.length,
      totalPages: Math.ceil(data.length / pageSize),
      currentPage: page
    };
  }, [data, page, pageSize, ...dependencies]);
};