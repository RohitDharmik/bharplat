import { useMutation, UseMutationOptions, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/axiosInstance';
import { useAppStore } from '../store/useAppStore';
import { MenuItem, User, InventoryItem, Reservation, Order, Table, OrderStatus, OrderType } from '../types';

/**
 * Custom hook for menu item mutations with Zustand integration
 * 
 * @param {UseMutationOptions<MenuItem, Error, MenuItem>} options - Mutation options
 * @returns {UseMutationResult<MenuItem, Error, MenuItem>} The mutation result
 */
export const useCreateMenuItemMutation = (options?: UseMutationOptions<MenuItem, Error, MenuItem>) => {
  const queryClient = useQueryClient();
  const { addMenuItem } = useAppStore();

  return useMutation<MenuItem, Error, MenuItem>({
    mutationFn: async (newItem) => {
      // const response = await api.createMenuItem(newItem);
      // return response;
      // For now, return the item as placeholder
      return newItem;
    },
    ...options,
    onSuccess: async (data) => {
      // Update Zustand state
      await addMenuItem(data);
      
      // Invalidate and refetch menu queries
      await queryClient.invalidateQueries({ queryKey: ['menu'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(data, undefined, undefined, undefined);
      }
    },
    onError: (error) => {
      console.error('Failed to create menu item:', error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, undefined, undefined, undefined);
      }
    },
  });
};

/**
 * Custom hook for deleting menu items with Zustand integration
 * 
 * @param {UseMutationOptions<void, Error, string>} options - Mutation options
 * @returns {UseMutationResult<void, Error, string>} The mutation result
 */
export const useDeleteMenuItemMutation = (options?: UseMutationOptions<void, Error, string>) => {
  const queryClient = useQueryClient();
  const { deleteMenuItem } = useAppStore();

  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      // await api.deleteMenuItem(id);
      // For now, just return
      return;
    },
    ...options,
    onSuccess: async (_, id) => {
      // Update Zustand state
      await deleteMenuItem(id);
      
      // Invalidate and refetch menu queries
      await queryClient.invalidateQueries({ queryKey: ['menu'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(_, id, undefined, undefined);
      }
    },
    onError: (error, id) => {
      console.error(`Failed to delete menu item ${id}:`, error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, id, undefined, undefined);
      }
    },
  });
};

/**
 * Custom hook for creating users with Zustand integration
 * 
 * @param {UseMutationOptions<User, Error, User>} options - Mutation options
 * @returns {UseMutationResult<User, Error, User>} The mutation result
 */
export const useCreateUserMutation = (options?: UseMutationOptions<User, Error, User>) => {
  const queryClient = useQueryClient();
  const { addUser } = useAppStore();

  return useMutation<User, Error, User>({
    mutationFn: async (newUser) => {
      // const response = await api.createUser(newUser);
      // return response;
      // For now, return the user as placeholder
      return newUser;
    },
    ...options,
    onSuccess: async (data) => {
      // Update Zustand state
      await addUser(data);
      
      // Invalidate and refetch users queries
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(data, undefined, undefined, undefined);
      }
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, undefined, undefined, undefined);
      }
    },
  });
};

/**
 * Custom hook for creating inventory items with Zustand integration
 * 
 * @param {UseMutationOptions<InventoryItem, Error, InventoryItem>} options - Mutation options
 * @returns {UseMutationResult<InventoryItem, Error, InventoryItem>} The mutation result
 */
export const useCreateInventoryItemMutation = (options?: UseMutationOptions<InventoryItem, Error, InventoryItem>) => {
  const queryClient = useQueryClient();
  const { addInventoryItem } = useAppStore();

  return useMutation<InventoryItem, Error, InventoryItem>({
    mutationFn: async (newItem) => {
      // const response = await api.createInventoryItem(newItem);
      // return response;
      // For now, return the item as placeholder
      return newItem;
    },
    ...options,
    onSuccess: async (data) => {
      // Update Zustand state
      await addInventoryItem(data);
      
      // Invalidate and refetch inventory queries
      await queryClient.invalidateQueries({ queryKey: ['inventory'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(data, undefined, undefined, undefined);
      }
    },
    onError: (error) => {
      console.error('Failed to create inventory item:', error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, undefined, undefined, undefined);
      }
    },
  });
};

/**
 * Custom hook for creating reservations with Zustand integration
 * 
 * @param {UseMutationOptions<Reservation, Error, Reservation>} options - Mutation options
 * @returns {UseMutationResult<Reservation, Error, Reservation>} The mutation result
 */
export const useCreateReservationMutation = (options?: UseMutationOptions<Reservation, Error, Reservation>) => {
  const queryClient = useQueryClient();
  const { addReservation } = useAppStore();

  return useMutation<Reservation, Error, Reservation>({
    mutationFn: async (newReservation) => {
      // const response = await api.createReservation(newReservation);
      // return response;
      // For now, return the reservation as placeholder
      return newReservation;
    },
    ...options,
    onSuccess: async (data) => {
      // Update Zustand state
      await addReservation(data);
      
      // Invalidate and refetch reservations queries
      await queryClient.invalidateQueries({ queryKey: ['reservations'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(data, undefined, undefined, undefined);
      }
    },
    onError: (error) => {
      console.error('Failed to create reservation:', error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, undefined, undefined, undefined);
      }
    },
  });
};

/**
 * Custom hook for placing orders with Zustand integration
 * 
 * @param {UseMutationOptions<Order, Error, { tableId: string; items: any[] }>} options - Mutation options
 * @returns {UseMutationResult<Order, Error, { tableId: string; items: any[] }>} The mutation result
 */
export const usePlaceOrderMutation = (options?: UseMutationOptions<Order, Error, { tableId: string; items: any[] }>) => {
  const queryClient = useQueryClient();
  const { placeOrder } = useAppStore();

  return useMutation<Order, Error, { tableId: string; items: any[] }>({
    mutationFn: async ({ tableId, items }) => {
      // const orderData = {
      //   tableId,
      //   items,
      //   totalAmount: items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      // };
      // const response = await api.createOrder(orderData);
      // return response;
      
      // For now, return mock order
      const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const gstRate = 5; // Configurable GST rate
      const gstAmount = (subtotal * gstRate) / 100;
      const totalAmount = subtotal + gstAmount;
      
      const mockOrder: Order = {
        id: `o${Date.now()}`,
        tableId,
        items,
        status: OrderStatus.PENDING,
        orderType: OrderType.DINE_IN, // Default to dine-in
        totalAmount,
        subtotal,
        gstRate,
        gstAmount,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return mockOrder;
    },
    ...options,
    onSuccess: async (data) => {
      // Update Zustand state
      await placeOrder(data.tableId, data.items);
      
      // Invalidate and refetch orders queries
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(data, undefined, undefined, undefined);
      }
    },
    onError: (error) => {
      console.error('Failed to place order:', error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, undefined, undefined, undefined);
      }
    },
  });
};

/**
 * Custom hook for updating order status with Zustand integration
 * 
 * @param {UseMutationOptions<Order, Error, { orderId: string; status: OrderStatus }>} options - Mutation options
 * @returns {UseMutationResult<Order, Error, { orderId: string; status: OrderStatus }>} The mutation result
 */
export const useUpdateOrderStatusMutation = (options?: UseMutationOptions<Order, Error, { orderId: string; status: OrderStatus }>) => {
  const queryClient = useQueryClient();
  const { updateOrderStatus } = useAppStore();

  return useMutation<Order, Error, { orderId: string; status: OrderStatus }>({
    mutationFn: async ({ orderId, status }) => {
      // const response = await api.updateOrderStatus(orderId, status);
      // return response;
      
      // For now, return mock response
      return { id: orderId, status } as Order;
    },
    ...options,
    onSuccess: async (data) => {
      // Update Zustand state
      await updateOrderStatus(data.id, data.status);
      
      // Invalidate and refetch orders queries
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(data, undefined, undefined, undefined);
      }
    },
    onError: (error, variables) => {
      console.error(`Failed to update order status ${variables.orderId}:`, error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, variables, undefined, undefined);
      }
    },
  });
};

/**
 * Custom hook for updating table status with Zustand integration
 * 
 * @param {UseMutationOptions<Table, Error, { tableId: string; status: string }>} options - Mutation options
 * @returns {UseMutationResult<Table, Error, { tableId: string; status: string }>} The mutation result
 */
export const useUpdateTableStatusMutation = (options?: UseMutationOptions<Table, Error, { tableId: string; status: string }>) => {
  const queryClient = useQueryClient();
  const { updateTableStatus } = useAppStore();

  return useMutation<Table, Error, { tableId: string; status: string }>({
    mutationFn: async ({ tableId, status }) => {
      // const response = await api.updateTableStatus(tableId, status);
      // return response;
      
      // For now, return mock response
      return { id: tableId, status } as Table;
    },
    ...options,
    onSuccess: async (data) => {
      // Update Zustand state
      await updateTableStatus(data.id, data.status);
      
      // Invalidate and refetch tables queries
      await queryClient.invalidateQueries({ queryKey: ['tables'] });
      
      // Call user's onSuccess if provided
      if (options && typeof options.onSuccess === 'function') {
        options.onSuccess(data, undefined, undefined, undefined);
      }
    },
    onError: (error, variables) => {
      console.error(`Failed to update table status ${variables.tableId}:`, error);
      if (options && typeof options.onError === 'function') {
        options.onError(error, variables, undefined, undefined);
      }
    },
  });
};

export default {
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useCreateUserMutation,
  useCreateInventoryItemMutation,
  useCreateReservationMutation,
  usePlaceOrderMutation,
  useUpdateOrderStatusMutation,
  useUpdateTableStatusMutation,
};
