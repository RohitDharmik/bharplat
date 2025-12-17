import { create } from 'zustand';
import { 
  MenuItem, User, InventoryItem, Reservation, Table, Order, 
  OrderStatus, TableStatus, OrderItem, UserRole 
} from '../types';
import { 
  MOCK_MENU, MOCK_USERS, MOCK_INVENTORY, MOCK_RESERVATIONS, 
  INITIAL_TABLES, MOCK_ORDERS 
} from '../constants';

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
  setGuestTableId: (id: string | null) => void;
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
          
          // In a real app, these would be: const res = await fetch('/api/menu');
          set({
              menu: MOCK_MENU,
              tables: INITIAL_TABLES,
              users: MOCK_USERS,
              orders: MOCK_ORDERS,
              inventory: MOCK_INVENTORY,
              reservations: MOCK_RESERVATIONS,
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
      await delay(600); // Simulate network
      const newMenu = [...get().menu, item];
      set({ menu: newMenu, isLoading: false });
      broadcast({ menu: newMenu });
    },

    deleteMenuItem: async (id) => {
      set({ isLoading: true });
      await delay(400);
      const newMenu = get().menu.filter(i => i.id !== id);
      set({ menu: newMenu, isLoading: false });
      broadcast({ menu: newMenu });
    },

    addUser: async (user) => {
      set({ isLoading: true });
      await delay(600);
      const newUsers = [...get().users, user];
      set({ users: newUsers, isLoading: false });
      broadcast({ users: newUsers });
    },

    addInventoryItem: async (item) => {
      set({ isLoading: true });
      await delay(600);
      const newInventory = [...get().inventory, item];
      set({ inventory: newInventory, isLoading: false });
      broadcast({ inventory: newInventory });
    },

    addReservation: async (reservation) => {
      set({ isLoading: true });
      await delay(600);
      const newReservations = [...get().reservations, reservation];
      set({ reservations: newReservations, isLoading: false });
      broadcast({ reservations: newReservations });
    },

    placeOrder: async (tableId, items) => {
      set({ isLoading: true });
      await delay(800);
      const newOrder: Order = {
        id: `o${Date.now()}`,
        tableId,
        items,
        status: OrderStatus.PENDING,
        totalAmount: items.reduce((acc, item) => acc + (item.price * item.quantity), 0),
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
    },

    updateOrderStatus: async (orderId, status) => {
      // Optimistic update
      const newOrders = get().orders.map(o => o.id === orderId ? { ...o, status } : o);
      set({ orders: newOrders });
      broadcast({ orders: newOrders });
      // Simulate bg sync
      await delay(200); 
    },

    updateOrderNotes: async (orderId, notes) => {
      const newOrders = get().orders.map(o => o.id === orderId ? { ...o, notes } : o);
      set({ orders: newOrders });
      broadcast({ orders: newOrders });
    },

    updateTableStatus: async (tableId, status) => {
      const newTables = get().tables.map(t => t.id === tableId ? { ...t, status } : t);
      set({ tables: newTables });
      broadcast({ tables: newTables });
    }
  };
});