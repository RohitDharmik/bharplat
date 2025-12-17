export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  MANAGER = 'Manager',
  COOK = 'Cook',
  CHEF = 'Chef',
  WAITER = 'Waiter',
  GUEST = 'Guest'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar?: string;
  email: string;
  status: 'Active' | 'Inactive';
  lastActive: Date;
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: Date;
  status: 'Present' | 'Absent' | 'Half-day';
  checkIn?: string;
  checkOut?: string;
}

export enum TableStatus {
  AVAILABLE = 'Available',
  OCCUPIED = 'Occupied',
  RESERVED = 'Reserved',
  DIRTY = 'Dirty'
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  zone: 'Main Hall' | 'Terrace' | 'VIP';
}

export interface MenuItem {
  id: string;
  name: string;
  category: 'Starter' | 'Main' | 'Dessert' | 'Drink';
  price: number;
  description: string;
  image: string;
  available: boolean;
}

export enum OrderStatus {
  PENDING = 'Pending',
  PREPARING = 'Preparing',
  READY = 'Ready',
  SERVED = 'Served',
  PAID = 'Paid'
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  notes?: string;
  price: number;
}

export interface Order {
  id: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  waiterId?: string;
  notes?: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: Date;
  guests: number;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
  assignedTableId?: string;
  notes?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  category: 'Produce' | 'Meat' | 'Dairy' | 'Spirits' | 'Dry Goods';
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  lastUpdated: Date;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  ingredients: {
    inventoryItemId: string;
    quantity: number;
    unit: string;
  }[];
}

export interface Purchase {
  id: string;
  date: Date;
  vendorName: string;
  totalAmount: number;
  status: 'Received' | 'Pending';
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
}

export interface Ticket {
  id: string;
  subject: string;
  category: 'Technical' | 'Billing' | 'Feature Request' | 'Other';
  description: string;
  status: 'Pending' | 'In Process' | 'Resolved' | 'Closed';
  createdAt: Date;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  validity: string; // e.g. "Monthly", "Yearly"
  features: string[];
}

export interface Feedback {
  id: string;
  customerName: string;
  rating: number; // 1-5
  comment: string;
  date: Date;
  tableId?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  visits: number;
  totalSpent: number;
  lastVisit: Date;
  notes?: string;
}