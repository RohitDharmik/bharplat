import { useQuery, UseQueryOptions, UseQueryResult, QueryKey } from '@tanstack/react-query';
import { useAppStore } from '../store/useAppStore';
import { api } from '../api/axiosInstance';

interface UseQueryWithZustandOptions<TData, TError> extends Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'> {
  onSuccess?: (data: TData) => void;
  onError?: (error: TError) => void;
}

/**
 * Custom hook that combines TanStack Query with Zustand state management
 * 
 * @template TQueryFnData - The type of data returned by the query function
 * @template TError - The type of error that can be thrown
 * @template TData - The type of data returned by the query (after transformation)
 * @param {QueryKey} queryKey - The query key
 * @param {() => Promise<TQueryFnData>} queryFn - The query function
 * @param {UseQueryWithZustandOptions<TQueryFnData, TError>} options - Query options
 * @returns {UseQueryResult<TData, TError>} The query result
 */
export const useQueryWithZustand = <
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData
 
>(
  queryKey: QueryKey,
  queryFn: () => Promise<TQueryFnData>,
  options?: UseQueryWithZustandOptions<TQueryFnData, TError>,
  onSuccess?: (data: TData) => void,
  onError?: (error: TError) => void

): UseQueryResult<TData, TError> => {
  const set = useAppStore();
  return {} as UseQueryResult<TData, TError>;
  // return useQuery<TQueryFnData, TError, TData>(
  // queryKey,
  // queryFn,
  // {
  //   ...options,
  //   onSuccess: (data) => {
  //     // Call the user's onSuccess callback if provided
  //     if (options?.onSuccess) {
  //       options.onSuccess(data);
  //     }

  //     // Update Zustand state with the fetched data
  //     // This ensures the data is available in the Zustand store
  //     // for components that don't use useQuery
  //     if (typeof data === 'object' && data !== null) {
  //       // @ts-ignore - Zustand's set function is available through the store creator
  //       set(data);
  //     }
  //   },
  //   onError: (error) => {
  //     // Call the user's onError callback if provided
  //     if (options?.onError) {
  //       options.onError(error);
  //     }

  //     // Log the error
  //     console.error(`Query error for ${queryKey}:`, error);
  //   },
  // }
  // );
};

/**
 * Custom hook for menu queries with Zustand integration
 */
export const useMenuQuery = () => {
  return useQueryWithZustand(
    ['menu'],
    async () => {
      // const response = await api.getMenu();
      // return response;
      // For now, return empty array as placeholder
      return [];
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        console.log('Menu data fetched:', data);
      },
    }
  );
};

/**
 * Custom hook for users queries with Zustand integration
 */
export const useUsersQuery = () => {
  return useQueryWithZustand(
    ['users'],
    async () => {
      // const response = await api.getUsers();
      // return response;
      // For now, return empty array as placeholder
      return [];
    },
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
      onSuccess: (data) => {
        console.log('Users data fetched:', data);
      },
    }
  );
};

/**
 * Custom hook for inventory queries with Zustand integration
 */
export const useInventoryQuery = () => {
  return useQueryWithZustand(
    ['inventory'],
    async () => {
      // const response = await api.getInventory();
      // return response;
      // For now, return empty array as placeholder
      return [];
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
        console.log('Inventory data fetched:', data);
      },
    }
  );
};

/**
 * Custom hook for reservations queries with Zustand integration
 */
export const useReservationsQuery = () => {
  return useQueryWithZustand(
    ['reservations'],
    async () => {
      // const response = await api.getReservations();
      // return response;
      // For now, return empty array as placeholder
      return [];
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      onSuccess: (data) => {
        console.log('Reservations data fetched:', data);
      },
    }
  );
};

/**
 * Custom hook for tables queries with Zustand integration
 */
export const useTablesQuery = () => {
  return useQueryWithZustand(
    ['tables'],
    async () => {
      // const response = await api.getTables();
      // return response;
      // For now, return empty array as placeholder
      return [];
    },
    {
      staleTime: 1 * 60 * 1000, // 1 minute
      onSuccess: (data) => {
        console.log('Tables data fetched:', data);
      },
    }
  );
};

/**
 * Custom hook for orders queries with Zustand integration
 */
export const useOrdersQuery = () => {
  return useQueryWithZustand(
    ['orders'],
    async () => {
      // const response = await api.getOrders();
      // return response;
      // For now, return empty array as placeholder
      return [];
    },
    {
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 10 * 1000, // Refetch every 10 seconds
      onSuccess: (data) => {
        console.log('Orders data fetched:', data);
      },
    }
  );
};

/**
 * Custom hook for reports queries with Zustand integration
 */
export const useReportsQuery = (params: any = {}) => {
  return useQueryWithZustand(
    ['reports', params],
    async () => {
      // const response = await api.getReports(params);
      // return response;
      // For now, return empty object as placeholder
      return {};
    },
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
      onSuccess: (data) => {
        console.log('Reports data fetched:', data);
      },
    }
  );
};

export default useQueryWithZustand;
