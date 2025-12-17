


1. Install dependencies:
   `npm install`
3. Run the app:
   `npm run dev`
# Axios Instance API Integration Summary

## Overview
This document summarizes the implementation of axiosInstance API calling across all pages in the LuxeDining CRM application.

## Files Created

### 1. `src/api/axiosInstance.ts`
- **Purpose**: Centralized axios configuration with interceptors
- **Features**:
  - Base URL configuration for Zastang API
  - Request interceptor for adding auth tokens
  - Response interceptor for error handling
  - Comprehensive API service methods for all endpoints

### 2. `src/hooks/useApi.ts`
- **Purpose**: Custom hook providing typed API methods
- **Features**:
  - Wraps axiosInstance methods with error handling
  - Provides hooks for all API endpoints
  - Memoized with useCallback for performance
  - Ready to be imported and used in any component

## Files Modified

### Store Integration
- **`src/store/useAppStore.ts`**:
  - Imported axiosInstance API
  - Updated all API methods to use axiosInstance
  - Added try-catch blocks for error handling
  - Maintained backward compatibility with mock data

### View Components Updated

1. **DashboardView** (`src/components/views/DashboardView.tsx`)
   - Added useApi hook
   - Integrated getReports API call
   - Ready to fetch dashboard metrics from API

2. **MenuManager** (`src/components/views/MenuManager.tsx`)
   - Added useApi hook
   - Integrated getMenu, createMenuItem, deleteMenuItem APIs
   - Ready to fetch and manage menu items from API

3. **UsersView** (`src/components/views/UsersView.tsx`)
   - Added useApi hook
   - Integrated getUsers, createUser APIs
   - Ready to fetch and manage user data from API

4. **InventoryView** (`src/components/views/InventoryView.tsx`)
   - Added useApi hook
   - Integrated getInventory, createInventoryItem APIs
   - Ready to fetch and manage inventory from API

5. **ReservationsView** (`src/components/views/ReservationsView.tsx`)
   - Added useApi hook
   - Integrated getReservations, createReservation APIs
   - Ready to fetch and manage reservations from API

6. **NewOrderView** (`src/components/views/NewOrderView.tsx`)
   - Added useApi hook
   - Integrated getMenu, createOrder APIs
   - Ready to fetch menu and place orders via API

7. **KitchenDisplay** (`src/components/views/KitchenDisplay.tsx`)
   - Added useApi hook
   - Integrated getOrders, updateOrderStatus APIs
   - Ready to fetch orders and update status via API

## Implementation Pattern

Each view component follows this pattern:

```typescript
import { useApi } from '../../hooks/useApi';

const MyComponent = () => {
  const { apiMethod1, apiMethod2 } = useApi();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Uncomment to use real API
        // const data = await apiMethod1();
        // console.log('Data from API:', data);
        console.log('MyComponent: Ready to fetch data from API using axiosInstance');
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
    
    fetchData();
  }, [apiMethod1]);
  
  const handleAction = async () => {
    try {
      // Uncomment to use real API
      // await apiMethod2(data);
      // Then update local state
      await localAction(data);
    } catch (error) {
      console.error('Failed to perform action:', error);
      // Handle error appropriately
    }
  };
  
  return (...);
};
```

## API Endpoints Available

### Auth
- `login(credentials)` - POST /auth/login

### Menu
- `getMenu()` - GET /menu
- `createMenuItem(item)` - POST /menu
- `updateMenuItem(id, item)` - PUT /menu/:id
- `deleteMenuItem(id)` - DELETE /menu/:id

### Tables
- `getTables()` - GET /tables
- `updateTableStatus(id, status)` - PUT /tables/:id/status

### Orders
- `getOrders()` - GET /orders
- `createOrder(order)` - POST /orders
- `updateOrderStatus(id, status)` - PUT /orders/:id/status

### Users
- `getUsers()` - GET /users
- `createUser(user)` - POST /users

### Inventory
- `getInventory()` - GET /inventory
- `createInventoryItem(item)` - POST /inventory

### Reservations
- `getReservations()` - GET /reservations
- `createReservation(reservation)` - POST /reservations

### Feedback
- `getFeedback()` - GET /feedback
- `createFeedback(feedback)` - POST /feedback

### Tickets
- `getTickets()` - GET /tickets
- `createTicket(ticket)` - POST /tickets

### Customers
- `getCustomers()` - GET /customers
- `createCustomer(customer)` - POST /customers

### Reports
- `getReports(params)` - GET /reports

### Payments
- `processPayment(payment)` - POST /payments
- `getPaymentHistory()` - GET /payments/history

### Recipes
- `getRecipes()` - GET /recipes
- `createRecipe(recipe)` - POST /recipes

### Purchases
- `getPurchases()` - GET /purchases
- `createPurchase(purchase)` - POST /purchases

## Next Steps

1. **Uncomment API calls**: In each component, uncomment the API calls to switch from mock data to real API
2. **Configure base URL**: Update the baseURL in `axiosInstance.ts` to point to your actual Zastang API endpoint
3. **Authentication**: Implement proper token storage and retrieval for authenticated requests
4. **Error handling**: Enhance error handling with user-friendly notifications
5. **Loading states**: Add loading indicators for API calls
6. **Pagination**: Implement pagination for list endpoints

## Benefits

1. **Consistent API calls**: All API calls go through a single configured axios instance
2. **Error handling**: Centralized error handling with interceptors
3. **Type safety**: Custom hook provides typed API methods
4. **Maintainability**: Easy to update API endpoints in one place
5. **Performance**: Memoized API methods prevent unnecessary re-renders
6. **Backward compatible**: Mock data still works while API is being implemented

## Notes

- All API calls are currently commented out and using mock data
- The implementation is ready to switch to real API calls by uncommenting the relevant lines
- Each component logs a message indicating it's ready to use the API
- Error handling is implemented at both the hook level and component level
<!-- Zustand -->
# Zustand Usage Summary - LuxeDining CRM

## Overview
This document summarizes the usage of Zustand (a state management library) throughout the entire LuxeDining CRM project.

## Zustand Store Structure

### **`src/store/useAppStore.ts`**
The central Zustand store that manages all application state.

### **State Management**
The store manages the following state:
- `menu`: Array of MenuItem objects
- `users`: Array of User objects  
- `inventory`: Array of InventoryItem objects
- `reservations`: Array of Reservation objects
- `tables`: Array of Table objects
- `orders`: Array of Order objects
- `isLoading`: Boolean flag for loading state
- `guestTableId`: String or null for guest table selection
- `isInitialized`: Boolean flag for app initialization status

### **Actions (Methods)**
The store provides the following actions:

#### **Data Fetching**
- `fetchInitialData()`: Fetches all initial data (menu, tables, users, orders, inventory, reservations)

#### **Menu Management**
- `addMenuItem(item)`: Adds a new menu item
- `deleteMenuItem(id)`: Deletes a menu item by ID

#### **User Management**
- `addUser(user)`: Adds a new user

#### **Inventory Management**
- `addInventoryItem(item)`: Adds a new inventory item

#### **Reservation Management**
- `addReservation(reservation)`: Adds a new reservation

#### **Order Management**
- `placeOrder(tableId, items)`: Places a new order
- `updateOrderStatus(orderId, status)`: Updates order status
- `updateOrderNotes(orderId, notes)`: Updates order notes

#### **Table Management**
- `updateTableStatus(tableId, status)`: Updates table status

#### **Guest Management**
- `setGuestTableId(id)`: Sets the guest table ID

### **Real-time Sync**
The store uses BroadcastChannel API for real-time synchronization across browser tabs:
```typescript
const syncChannel = new BroadcastChannel('bharplate_app_sync');
```

- **Broadcast Function**: Posts state updates to all connected tabs
- **Sync Listener**: Listens for state updates from other tabs and merges them with current state

## Components Using Zustand

### **Views (24 components)**

1. **ActiveOrdersView** - Uses: `updateOrderNotes`, `updateOrderStatus`
2. **CustomersView** - Uses: `orders`, `tables`
3. **DashboardView** - Uses: `orders`
4. **FeedbackView** - Uses: No direct Zustand usage
5. **GuestPortal** (3 sub-components):
   - `GuestTableSelection` - Uses: `tables`, `setGuestTableId`
   - `GuestMenu` - Uses: `menu`, `placeOrder`, `guestTableId`, `tables`
   - `GuestBill` - Uses: `orders`, `guestTableId`, `updateOrderStatus`, `tables`
6. **InventoryView** - Uses: `inventory`, `addInventoryItem`, `isLoading`
7. **KitchenDisplay** - Uses: `tables`
8. **LoginScreen** - Uses: No direct Zustand usage
9. **MenuManager** - Uses: `menu`, `addMenuItem`, `deleteMenuItem`, `isLoading`
10. **NewOrderView** - Uses: No direct Zustand usage (uses props)
11. **PaymentHistoryView** - Uses: `orders`, `tables`
12. **PaymentsView** - Uses: `menu`
13. **ProfileView** - Uses: No direct Zustand usage
14. **PurchaseView** - Uses: No direct Zustand usage
15. **QRCodeManagerView** - Uses: `tables`
16. **RecipeView** - Uses: No direct Zustand usage
17. **ReportsView** - Uses: No direct Zustand usage
18. **ReservationsView** - Uses: `reservations`, `addReservation`, `isLoading`
19. **SettingsView** - Uses: No direct Zustand usage
20. **SubscriptionView** - Uses: No direct Zustand usage
21. **SuperAdminDashboard** - Uses: No direct Zustand usage
22. **TableMap** - Uses: No direct Zustand usage (uses props)
23. **TicketsView** - Uses: No direct Zustand usage
24. **UsersView** - Uses: `users`, `addUser`, `isLoading`
25. **WaiterView** - Uses: `addReservation`, `updateOrderNotes`

### **UI Components (1 component)**

1. **AdminTableModal** - Uses: `orders`

### **App Router (1 component)**

1. **AppRouter** - Uses: `tables`, `orders`, `guestTableId`

## Usage Pattern

### **Importing the Store**
```typescript
import { useAppStore } from '../../store/useAppStore';
```

### **Accessing State and Actions**
```typescript
const { stateProperty, actionMethod } = useAppStore();
```

### **Example Usage in Component**
```typescript
import React from 'react';
import { useAppStore } from '../../store/useAppStore';

export const MenuManager: React.FC = () => {
  const { menu, addMenuItem, deleteMenuItem, isLoading } = useAppStore();
  
  const handleAddItem = async (item) => {
    await addMenuItem(item);
  };
  
  const handleDeleteItem = async (id) => {
    await deleteMenuItem(id);
  };
  
  return (
    <div>
      {menu.map(item => (
        <div key={item.id}>
          {item.name}
          <button onClick={() => handleDeleteItem(item.id)}>
            Delete
          </button>
        </div>
      ))}
      <button onClick={handleAddItem} disabled={isLoading}>
        Add Item
      </button>
    </div>
  );
};
```

## Benefits of Zustand Usage

1. **Centralized State Management**: All app state is managed in one place
2. **Performance**: Minimal re-renders with selective state subscription
3. **Simplicity**: No boilerplate compared to Redux
4. **Real-time Sync**: Automatic synchronization across browser tabs
5. **Type Safety**: Full TypeScript support
6. **Server State Integration**: Easy integration with API calls
7. **No Provider Wrapping**: No need for context providers
8. **Small Bundle Size**: Zustand has minimal footprint

## Zustand + Axios Integration

The project now integrates Zustand with the new axiosInstance API:

- **Store Level**: Zustand actions call axiosInstance methods (commented out, using mock data as fallback)
- **Component Level**: Components use both Zustand for local state and useApi hook for direct API calls
- **Dual Approach**: Allows gradual migration from mock data to real API

### **Integration Pattern**
```typescript
import { useAppStore } from '../../store/useAppStore';
import { useApi } from '../../hooks/useApi';

export const MenuManager: React.FC = () => {
  // Zustand for local state
  const { menu, addMenuItem, isLoading } = useAppStore();
  
  // API hook for direct API calls
  const { getMenu, createMenuItem: apiCreateMenuItem } = useApi();
  
  useEffect(() => {
    const fetchData = async () => {
      // Option 1: Use API directly
      // const menuData = await getMenu();
      
      // Option 2: Use Zustand action (which internally can use API)
      await fetchInitialData();
    };
    
    fetchData();
  }, []);
};
```

## State Flow

1. **Initialization**: `fetchInitialData()` loads all data on app start
2. **Local Updates**: Actions update Zustand state optimistically
3. **API Sync**: Actions call axiosInstance to sync with backend
4. **Broadcast**: Changes are broadcast to other tabs via BroadcastChannel
5. **Reconciliation**: Response interceptor handles API errors and reverts state if needed

## Conclusion

Zustand is used extensively throughout the LuxeDining CRM project for:
- Centralized state management
- Real-time synchronization across tabs
- Clean separation of concerns
- Easy integration with API calls
- Type-safe state management

The implementation provides a solid foundation for both client-side state and server-side data synchronization.

