import { create } from 'zustand';
import {
  MenuItem, User, InventoryItem, Reservation, Table, Order,
  OrderStatus, OrderType, TableStatus, OrderItem, UserRole, Ticket, OutletSubscription, Area, KOT
} from '../types';
import {
  MOCK_MENU, MOCK_USERS, MOCK_INVENTORY, MOCK_RESERVATIONS,
  INITIAL_TABLES, MOCK_ORDERS, MOCK_TICKETS, MOCK_OUTLET_SUBSCRIPTIONS, MOCK_AREAS
} from '../constants';
import { api } from '../api/axiosInstance';

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Broadcast Channel for Real-time Sync
const syncChannel = new BroadcastChannel('bharplate_app_sync');

interface AppState {
  menu: MenuItem[];
  users: User[];
  inventory: InventoryItem[];
  reservations: Reservation[];
  tables: Table[];
  orders: Order[];
  kots: KOT[];
  tickets: Ticket[];
  outletSubscriptions: OutletSubscription[];
  areas: Area[];
  isLoading: boolean;
  guestTableId: string | null;
  isInitialized: boolean;

  // Actions
  fetchInitialData: () => Promise<void>;
  addMenuItem: (item: MenuItem) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;

  addUser: (user: User) => Promise<void>;

  addInventoryItem: (item: InventoryItem) => Promise<void>;

  addReservation: (reservation: Reservation) => Promise<void>;

  placeOrder: (tableId: string, items: OrderItem[]) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  updateOrderNotes: (orderId: string, notes: string) => Promise<void>;
  updateTableStatus: (tableId: string, status: TableStatus) => Promise<void>;
  generateKOT: (orderId: string, items: OrderItem[], area: 'Food' | 'Beverage') => Promise<void>;
  setGuestTableId: (id: string | null) => void;

  // Ticket actions
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTicket: (id: string, updates: Partial<Ticket>) => Promise<void>;
  closeTicket: (id: string) => Promise<void>;

  // Subscription actions
  createSubscription: (subscription: Omit<OutletSubscription, 'id'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<OutletSubscription>) => Promise<void>;
  cancelSubscription: (id: string) => Promise<void>;

  // Area actions
  createArea: (area: Omit<Area, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateArea: (id: string, updates: Partial<Area>) => Promise<void>;
  deleteArea: (id: string) => Promise<void>;

  // Table actions
  createTable: (table: Omit<Table, 'id'>) => Promise<void>;
  updateTable: (id: string, updates: Partial<Table>) => Promise<void>;
  deleteTable: (id: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => {
  
  // Listen for sync events from other tabs
  syncChannel.onmessage = (event) => {
    const data = event.data;
    // Only update if data is valid object and not null
    if (data && typeof data === 'object') {
       // Merge incoming state with current state
       set((state) => ({ ...state, ...data }));
    }
  };

  const broadcast = (data: Partial<AppState>) => {
    syncChannel.postMessage(data);
  };

  return {
    menu: [],
    users: [],
    inventory: [],
    reservations: [],
    tables: [],
    orders: [],
    kots: [],
    tickets: [],
    outletSubscriptions: [],
    areas: [],
    isLoading: false,
    isInitialized: false,
    guestTableId: null,

    setGuestTableId: (id) => set({ guestTableId: id }),

    fetchInitialData: async () => {
      if (get().isInitialized) return;
        
      set({ isLoading: true });
      // Simulate API Network Waterfall
      try {
          await delay(800); // Simulate Auth & Core Data fetch
          
          // Using axiosInstance to fetch data from API
          // const menuRes = await api.getMenu();
          // const tablesRes = await api.getTables();
          // const usersRes = await api.getUsers();
          // const ordersRes = await api.getOrders();
          // const inventoryRes = await api.getInventory();
          // const reservationsRes = await api.getReservations();
          
          // For now, using mock data as fallback
          set({
              menu: MOCK_MENU,
              tables: INITIAL_TABLES,
              users: MOCK_USERS,
              orders: MOCK_ORDERS,
              inventory: MOCK_INVENTORY,
              reservations: MOCK_RESERVATIONS,
              tickets: MOCK_TICKETS,
              outletSubscriptions: MOCK_OUTLET_SUBSCRIPTIONS,
              areas: MOCK_AREAS,
              isInitialized: true,
              isLoading: false
          });
      } catch (error) {
          console.error("Failed to fetch data", error);
          set({ isLoading: false });
      }
    },

    addMenuItem: async (item) => {
      set({ isLoading: true });
      try {
        // Using axiosInstance to create menu item
        // const response = await api.createMenuItem(item);
        // const newMenu = [...get().menu, response];
        
        // For now, using mock implementation
        await delay(600); // Simulate network
        const newMenu = [...get().menu, item];
        set({ menu: newMenu, isLoading: false });
        broadcast({ menu: newMenu });
      } catch (error) {
        console.error("Failed to add menu item", error);
        set({ isLoading: false });
      }
    },

    deleteMenuItem: async (id) => {
      set({ isLoading: true });
      try {
        // Using axiosInstance to delete menu item
        // await api.deleteMenuItem(id);
        
        // For now, using mock implementation
        await delay(400);
        const newMenu = get().menu.filter(i => i.id !== id);
        set({ menu: newMenu, isLoading: false });
        broadcast({ menu: newMenu });
      } catch (error) {
        console.error("Failed to delete menu item", error);
        set({ isLoading: false });
      }
    },

    addUser: async (user) => {
      set({ isLoading: true });
      try {
        // Using axiosInstance to create user
        // const response = await api.createUser(user);
        // const newUsers = [...get().users, response];
        
        // For now, using mock implementation
        await delay(600);
        const newUsers = [...get().users, user];
        set({ users: newUsers, isLoading: false });
        broadcast({ users: newUsers });
      } catch (error) {
        console.error("Failed to add user", error);
        set({ isLoading: false });
      }
    },

    addInventoryItem: async (item) => {
      set({ isLoading: true });
      try {
        // Using axiosInstance to create inventory item
        // const response = await api.createInventoryItem(item);
        // const newInventory = [...get().inventory, response];
        
        // For now, using mock implementation
        await delay(600);
        const newInventory = [...get().inventory, item];
        set({ inventory: newInventory, isLoading: false });
        broadcast({ inventory: newInventory });
      } catch (error) {
        console.error("Failed to add inventory item", error);
        set({ isLoading: false });
      }
    },

    addReservation: async (reservation) => {
      set({ isLoading: true });
      try {
        // Using axiosInstance to create reservation
        // const response = await api.createReservation(reservation);
        // const newReservations = [...get().reservations, response];
        
        // For now, using mock implementation
        await delay(600);
        const newReservations = [...get().reservations, reservation];
        set({ reservations: newReservations, isLoading: false });
        broadcast({ reservations: newReservations });
      } catch (error) {
        console.error("Failed to add reservation", error);
        set({ isLoading: false });
      }
    },

    placeOrder: async (tableId, items) => {
      set({ isLoading: true });
      try {
        // Using axiosInstance to create order
        // const orderData = {
        //   tableId,
        //   items,
        //   totalAmount: items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        // };
        // const response = await api.createOrder(orderData);
        
        // For now, using mock implementation
        await delay(800);
        const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        const gstRate = 5; // Configurable GST rate
        const gstAmount = (subtotal * gstRate) / 100;
        const totalAmount = subtotal + gstAmount;

        const newOrder: Order = {
          id: `item${Date.now()}`,
          tableId,
          items,
          status: OrderStatus.ORDERED,
          orderType: OrderType.DINE_IN, // Default to dine-in, can be changed later
          totalAmount,
          subtotal,
          gstRate,
          gstAmount,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        const newOrders = [...get().orders, newOrder];
        // Auto update table status to occupied if placing order
        const newTables = get().tables.map(t => t.id === tableId ? { ...t, status: TableStatus.OCCUPIED } : t);
        
        set({
          orders: newOrders,
          tables: newTables,
          isLoading: false
        });
        broadcast({ orders: newOrders, tables: newTables });
      } catch (error) {
        console.error("Failed to place order", error);
        set({ isLoading: false });
      }
    },

    generateKOT: async (orderId, items, area) => {
      set({ isLoading: true });
      try {
        await delay(600);
        const newKOT: KOT = {
          id: `kot${Date.now()}`,
          orderId,
          items,
          area,
          createdAt: new Date(),
          printed: false
        };

        const newKots = [...get().kots, newKOT];
        set({ kots: newKots, isLoading: false });
        broadcast({ kots: newKots });

        // Update order with KOT reference
        const newOrders = get().orders.map(order =>
          order.id === orderId
            ? { ...order, kotIds: [...(order.kotIds || []), newKOT.id] }
            : order
        );
        set({ orders: newOrders });
        broadcast({ orders: newOrders });
      } catch (error) {
        console.error("Failed to generate KOT", error);
        set({ isLoading: false });
      }
    },

    updateOrderStatus: async (orderId, status) => {
      // Optimistic update
      const newOrders = get().orders.map(item => item.id === orderId ? { ...item, status } : item);
      set({ orders: newOrders });
      broadcast({ orders: newOrders });
      
      try {
        // Using axiosInstance to update order status
        // await api.updateOrderStatus(orderId, status);
        // Simulate bg sync
        await delay(200);
      } catch (error) {
        console.error("Failed to update order status", error);
        // Revert on error
        const originalOrders = get().orders;
        set({ orders: originalOrders });
      }
    },

    updateOrderNotes: async (orderId, notes) => {
      const newOrders = get().orders.map(item => item.id === orderId ? { ...item, notes } : item);
      set({ orders: newOrders });
      broadcast({ orders: newOrders });
      
      try {
        // Using axiosInstance to update order notes
        // await api.updateOrderNotes(orderId, notes);
      } catch (error) {
        console.error("Failed to update order notes", error);
        // Revert on error
        const originalOrders = get().orders;
        set({ orders: originalOrders });
      }
    },

    updateTableStatus: async (tableId, status) => {
      const newTables = get().tables.map(t => t.id === tableId ? { ...t, status } : t);
      set({ tables: newTables });
      broadcast({ tables: newTables });

      try {
        // Using axiosInstance to update table status
        // await api.updateTableStatus(tableId, status);
      } catch (error) {
        console.error("Failed to update table status", error);
        // Revert on error
        const originalTables = get().tables;
        set({ tables: originalTables });
      }
    },

    // Ticket actions
    createTicket: async (ticketData) => {
      set({ isLoading: true });
      try {
        await delay(600);
        const newTicket: Ticket = {
          ...ticketData,
          id: `tk${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const newTickets = [...get().tickets, newTicket];
        set({ tickets: newTickets, isLoading: false });
        broadcast({ tickets: newTickets });
      } catch (error) {
        console.error("Failed to create ticket", error);
        set({ isLoading: false });
      }
    },

    updateTicket: async (id, updates) => {
      const newTickets = get().tickets.map(ticket =>
        ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date() } : ticket
      );
      set({ tickets: newTickets });
      broadcast({ tickets: newTickets });

      try {
        await delay(200);
      } catch (error) {
        console.error("Failed to update ticket", error);
        // Revert on error
        const originalTickets = get().tickets;
        set({ tickets: originalTickets });
      }
    },

    closeTicket: async (id) => {
      const newTickets = get().tickets.map(ticket =>
        ticket.id === id ? { ...ticket, status: 'Closed' as const, updatedAt: new Date() } : ticket
      );
      set({ tickets: newTickets });
      broadcast({ tickets: newTickets });

      try {
        await delay(200);
      } catch (error) {
        console.error("Failed to close ticket", error);
        // Revert on error
        const originalTickets = get().tickets;
        set({ tickets: originalTickets });
      }
    },

    // Subscription actions
    createSubscription: async (subscriptionData) => {
      set({ isLoading: true });
      try {
        await delay(600);
        const newSubscription: OutletSubscription = {
          ...subscriptionData,
          id: `os${Date.now()}`
        };
        const newSubscriptions = [...get().outletSubscriptions, newSubscription];
        set({ outletSubscriptions: newSubscriptions, isLoading: false });
        broadcast({ outletSubscriptions: newSubscriptions });
      } catch (error) {
        console.error("Failed to create subscription", error);
        set({ isLoading: false });
      }
    },

    updateSubscription: async (id, updates) => {
      const newSubscriptions = get().outletSubscriptions.map(sub =>
        sub.id === id ? { ...sub, ...updates } : sub
      );
      set({ outletSubscriptions: newSubscriptions });
      broadcast({ outletSubscriptions: newSubscriptions });

      try {
        await delay(200);
      } catch (error) {
        console.error("Failed to update subscription", error);
        // Revert on error
        const originalSubscriptions = get().outletSubscriptions;
        set({ outletSubscriptions: originalSubscriptions });
      }
    },

    cancelSubscription: async (id) => {
      const newSubscriptions = get().outletSubscriptions.map(sub =>
        sub.id === id ? { ...sub, status: 'Cancelled' as const } : sub
      );
      set({ outletSubscriptions: newSubscriptions });
      broadcast({ outletSubscriptions: newSubscriptions });

      try {
        await delay(200);
      } catch (error) {
        console.error("Failed to cancel subscription", error);
        // Revert on error
        const originalSubscriptions = get().outletSubscriptions;
        set({ outletSubscriptions: originalSubscriptions });
      }
    },

    // Area actions
    createArea: async (areaData) => {
      set({ isLoading: true });
      try {
        await delay(600);
        const newArea: Area = {
          ...areaData,
          id: `a${Date.now()}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const newAreas = [...get().areas, newArea];
        set({ areas: newAreas, isLoading: false });
        broadcast({ areas: newAreas });
      } catch (error) {
        console.error("Failed to create area", error);
        set({ isLoading: false });
      }
    },

    updateArea: async (id, updates) => {
      const newAreas = get().areas.map(area =>
        area.id === id ? { ...area, ...updates, updatedAt: new Date() } : area
      );
      set({ areas: newAreas });
      broadcast({ areas: newAreas });

      try {
        await delay(200);
      } catch (error) {
        console.error("Failed to update area", error);
        const originalAreas = get().areas;
        set({ areas: originalAreas });
      }
    },

    deleteArea: async (id) => {
      set({ isLoading: true });
      try {
        await delay(400);
        const newAreas = get().areas.filter(area => area.id !== id);
        set({ areas: newAreas, isLoading: false });
        broadcast({ areas: newAreas });
      } catch (error) {
        console.error("Failed to delete area", error);
        set({ isLoading: false });
      }
    },

    // Table actions
    createTable: async (tableData) => {
      set({ isLoading: true });
      try {
        await delay(600);
        const newTable: Table = {
          ...tableData,
          id: `t${Date.now()}`
        };
        const newTables = [...get().tables, newTable];
        set({ tables: newTables, isLoading: false });
        broadcast({ tables: newTables });
      } catch (error) {
        console.error("Failed to create table", error);
        set({ isLoading: false });
      }
    },

    updateTable: async (id, updates) => {
      const newTables = get().tables.map(table =>
        table.id === id ? { ...table, ...updates } : table
      );
      set({ tables: newTables });
      broadcast({ tables: newTables });

      try {
        await delay(200);
      } catch (error) {
        console.error("Failed to update table", error);
        const originalTables = get().tables;
        set({ tables: originalTables });
      }
    },

    deleteTable: async (id) => {
      set({ isLoading: true });
      try {
        await delay(400);
        const newTables = get().tables.filter(table => table.id !== id);
        set({ tables: newTables, isLoading: false });
        broadcast({ tables: newTables });
      } catch (error) {
        console.error("Failed to delete table", error);
        set({ isLoading: false });
      }
    }
  };
});
