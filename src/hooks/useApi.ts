import { useCallback } from 'react';
import { api } from '../api/axiosInstance';

/**
 * Custom hook for API operations using axiosInstance
 * Provides typed API methods for all endpoints
 */
export const useApi = () => {
  // Menu API
  const getMenu = useCallback(async () => {
    try {
      const data = await api.getMenu();
      return data;
    } catch (error) {
      console.error('Failed to fetch menu:', error);
      throw error;
    }
  }, []);

  const createMenuItem = useCallback(async (item: any) => {
    try {
      const data = await api.createMenuItem(item);
      return data;
    } catch (error) {
      console.error('Failed to create menu item:', error);
      throw error;
    }
  }, []);

  const updateMenuItem = useCallback(async (id: string, item: any) => {
    try {
      const data = await api.updateMenuItem(id, item);
      return data;
    } catch (error) {
      console.error('Failed to update menu item:', error);
      throw error;
    }
  }, []);

  const deleteMenuItem = useCallback(async (id: string) => {
    try {
      await api.deleteMenuItem(id);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete menu item:', error);
      throw error;
    }
  }, []);

  // Tables API
  const getTables = useCallback(async () => {
    try {
      const data = await api.getTables();
      return data;
    } catch (error) {
      console.error('Failed to fetch tables:', error);
      throw error;
    }
  }, []);

  const updateTableStatus = useCallback(async (id: string, status: string) => {
    try {
      const data = await api.updateTableStatus(id, status);
      return data;
    } catch (error) {
      console.error('Failed to update table status:', error);
      throw error;
    }
  }, []);

  // Orders API
  const getOrders = useCallback(async () => {
    try {
      const data = await api.getOrders();
      return data;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }, []);

  const createOrder = useCallback(async (order: any) => {
    try {
      const data = await api.createOrder(order);
      return data;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: string, status: string) => {
    try {
      const data = await api.updateOrderStatus(id, status);
      return data;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }, []);

  // Users API
  const getUsers = useCallback(async () => {
    try {
      const data = await api.getUsers();
      return data;
    } catch (error) {
      console.error('Failed to fetch users:', error);
      throw error;
    }
  }, []);

  const createUser = useCallback(async (user: any) => {
    try {
      const data = await api.createUser(user);
      return data;
    } catch (error) {
      console.error('Failed to create user:', error);
      throw error;
    }
  }, []);

  // Inventory API
  const getInventory = useCallback(async () => {
    try {
      const data = await api.getInventory();
      return data;
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
      throw error;
    }
  }, []);

  const createInventoryItem = useCallback(async (item: any) => {
    try {
      const data = await api.createInventoryItem(item);
      return data;
    } catch (error) {
      console.error('Failed to create inventory item:', error);
      throw error;
    }
  }, []);

  // Reservations API
  const getReservations = useCallback(async () => {
    try {
      const data = await api.getReservations();
      return data;
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      throw error;
    }
  }, []);

  const createReservation = useCallback(async (reservation: any) => {
    try {
      const data = await api.createReservation(reservation);
      return data;
    } catch (error) {
      console.error('Failed to create reservation:', error);
      throw error;
    }
  }, []);

  // Feedback API
  const getFeedback = useCallback(async () => {
    try {
      const data = await api.getFeedback();
      return data;
    } catch (error) {
      console.error('Failed to fetch feedback:', error);
      throw error;
    }
  }, []);

  const createFeedback = useCallback(async (feedback: any) => {
    try {
      const data = await api.createFeedback(feedback);
      return data;
    } catch (error) {
      console.error('Failed to create feedback:', error);
      throw error;
    }
  }, []);

  // Tickets API
  const getTickets = useCallback(async () => {
    try {
      const data = await api.getTickets();
      return data;
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
      throw error;
    }
  }, []);

  const createTicket = useCallback(async (ticket: any) => {
    try {
      const data = await api.createTicket(ticket);
      return data;
    } catch (error) {
      console.error('Failed to create ticket:', error);
      throw error;
    }
  }, []);

  // Customers API
  const getCustomers = useCallback(async () => {
    try {
      const data = await api.getCustomers();
      return data;
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  }, []);

  const createCustomer = useCallback(async (customer: any) => {
    try {
      const data = await api.createCustomer(customer);
      return data;
    } catch (error) {
      console.error('Failed to create customer:', error);
      throw error;
    }
  }, []);

  // Reports API
  const getReports = useCallback(async (params: any = {}) => {
    try {
      const data = await api.getReports(params);
      return data;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      throw error;
    }
  }, []);

  // Payments API
  const processPayment = useCallback(async (payment: any) => {
    try {
      const data = await api.processPayment(payment);
      return data;
    } catch (error) {
      console.error('Failed to process payment:', error);
      throw error;
    }
  }, []);

  const getPaymentHistory = useCallback(async () => {
    try {
      const data = await api.getPaymentHistory();
      return data;
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
      throw error;
    }
  }, []);

  // Recipes API
  const getRecipes = useCallback(async () => {
    try {
      const data = await api.getRecipes();
      return data;
    } catch (error) {
      console.error('Failed to fetch recipes:', error);
      throw error;
    }
  }, []);

  const createRecipe = useCallback(async (recipe: any) => {
    try {
      const data = await api.createRecipe(recipe);
      return data;
    } catch (error) {
      console.error('Failed to create recipe:', error);
      throw error;
    }
  }, []);

  // Purchase API
  const getPurchases = useCallback(async () => {
    try {
      const data = await api.getPurchases();
      return data;
    } catch (error) {
      console.error('Failed to fetch purchases:', error);
      throw error;
    }
  }, []);

  const createPurchase = useCallback(async (purchase: any) => {
    try {
      const data = await api.createPurchase(purchase);
      return data;
    } catch (error) {
      console.error('Failed to create purchase:', error);
      throw error;
    }
  }, []);

  return {
    // Menu
    getMenu,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    
    // Tables
    getTables,
    updateTableStatus,
    
    // Orders
    getOrders,
    createOrder,
    updateOrderStatus,
    
    // Users
    getUsers,
    createUser,
    
    // Inventory
    getInventory,
    createInventoryItem,
    
    // Reservations
    getReservations,
    createReservation,
    
    // Feedback
    getFeedback,
    createFeedback,
    
    // Tickets
    getTickets,
    createTicket,
    
    // Customers
    getCustomers,
    createCustomer,
    
    // Reports
    getReports,
    
    // Payments
    processPayment,
    getPaymentHistory,
    
    // Recipes
    getRecipes,
    createRecipe,
    
    // Purchases
    getPurchases,
    createPurchase,
  };
};
