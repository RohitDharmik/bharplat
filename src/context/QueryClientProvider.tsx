import React from 'react';
import { QueryClient, QueryClientProvider as TanStackQueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // With SSR, we usually want to set some default staleTime
      // above 0 to avoid refetching immediately on the client
      staleTime: 60 * 1000, // 1 minute
      
      // Here we can set other default options for queries
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      refetchOnReconnect: true,
      retry: 3, // Retry failed requests 3 times
      retryDelay: 1000, // Wait 1 second before retrying
    },
    mutations: {
      // Default options for mutations
      retry: 1, // Retry failed mutations once
      retryDelay: 1000,
    },
  },
});

interface QueryClientProviderProps {
  children: React.ReactNode;
}

/**
 * QueryClientProvider component
 * Wraps the application with TanStack Query context
 * 
 * @param {React.ReactNode} children - The child components to wrap
 * @returns {JSX.Element} The QueryClientProvider with children
 */
export const QueryClientProvider: React.FC<QueryClientProviderProps> = ({ children }) => {
  return (
    <TanStackQueryClientProvider client={queryClient}>
      {children}
    </TanStackQueryClientProvider>
  );
};

export default queryClient;
