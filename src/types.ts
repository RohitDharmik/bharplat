export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  SUB_ADMIN = 'Sub Admin',
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

export interface Area {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: TableStatus;
  currentOrderId?: string;
  areaId: string;
  zone?: string; // Optional zone property for VIP designation
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
  ORDERED = 'Ordered',
  PREPARING = 'Preparing',
  READY = 'Ready',
  SERVED = 'Served',
  COMPLETED = 'Completed',
  PAID = 'Paid',
  PENDING = 'Pending'
}

export enum OrderType {
  DINE_IN = 'Dine-In',
  PICK_UP = 'Pick-Up',
  IN_CAR = 'In-Car'
}

export enum DiscountType {
  PERCENTAGE = 'Percentage',
  FLAT = 'Flat Amount'
}

export enum PaymentMethod {
  CASH = 'Cash',
  CARD = 'Card',
  UPI = 'UPI',
  WALLET = 'Wallet'
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  notes?: string;
  price: number;
}

export interface Discount {
  type: DiscountType;
  value: number;
  reason: string;
}

export interface KOT {
  id: string;
  orderId: string;
  items: OrderItem[];
  area: 'Food' | 'Beverage';
  createdAt: Date;
  printed: boolean;
}

export interface Order {
  id: string;
  tableId?: string; // Optional for non-dine-in orders
  items: OrderItem[];
  status: OrderStatus;
  orderType: OrderType;
  totalAmount: number;
  subtotal: number;
  discount?: Discount;
  gstRate: number; // Configurable GST rate
  gstAmount: number;
  createdAt: Date;
  updatedAt: Date;
  waiterId?: string;
  notes?: string;
  kotIds?: string[]; // References to KOTs generated
  isComplimentary?: boolean;
  advancePayment?: number;
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
  updatedAt: Date;
  assignedTo?: string; // Admin ID
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  outletId?: string; // For multi-outlet support
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  validity: string; // e.g. "Monthly", "Yearly"
  features: string[];
  maxOutlets?: number;
  isActive: boolean;
}

// Subscription instance for outlets
export interface OutletSubscription {
  id: string;
  outletId: string;
  planId: string;
  startDate: Date;
  endDate: Date;
  status: 'Active' | 'Expired' | 'Cancelled';
  autoRenew: boolean;
  paymentMethod?: string;
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

// Super Admin Governance Types

export enum OutletScope {
  SINGLE = 'Single Outlet',
  MULTI = 'Multi-Outlet'
}

export enum FeatureAuthority {
  MANAGE_MENUS = 'Can manage menus',
  MANAGE_TABLES = 'Can manage tables & areas',
  MANAGE_ORDERS = 'Can manage orders',
  MANAGE_BILLING = 'Can manage billing',
  MANAGE_REPORTS = 'Can manage reports',
  MANAGE_INVENTORY = 'Can manage inventory',
  MANAGE_USERS = 'Can manage users',
  MANAGE_TICKETS = 'Can manage tickets',
  MANAGE_SUBSCRIPTIONS = 'Can manage subscriptions',
  VIEW_AUDIT_LOGS = 'Can view audit logs'
}

export enum RoleDelegation {
  BRANCH_OWNER = 'Branch Owner',
  CAPTAIN = 'Captain',
  KITCHEN_STAFF = 'Kitchen Staff'
}

export enum PageAuthority {
  DASHBOARD = 'Dashboard',
  ORDERS = 'Orders',
  BILLING = 'Billing',
  REPORTS = 'Reports',
  INVENTORY = 'Inventory',
  USERS = 'Users',
  SETTINGS = 'Settings',
  TICKET_MANAGEMENT = 'Ticket Management',
  SUBSCRIPTION_MANAGEMENT = 'Subscription Management'
}

export enum NavigationControl {
  SEE = 'See',
  ENABLE = 'Enable for others',
  HIDE = 'Hide from others'
}

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  password: string; // hashed in real impl
  outletScope: OutletScope;
  status: 'Active' | 'Inactive';
  createdAt: Date;
  updatedAt: Date;
  responsibilityMatrix: ResponsibilityMatrix;
}

export interface ResponsibilityMatrix {
  featureAuthority: Record<FeatureAuthority, boolean>;
  roleDelegation: {
    canCreate: RoleDelegation[];
    canAssignPermissions: RoleDelegation[];
    canViewOnly: RoleDelegation[];
  };
  pageAuthority: Record<PageAuthority, boolean>;
  navigationControl: Record<PageAuthority, NavigationControl>;
}

export interface AuditLogEntry {
  id: string;
  adminId: string;
  action: string;
  details: string;
  timestamp: Date;
  performedBy: string; // Super Admin id
  entityType: 'ticket' | 'subscription' | 'admin' | 'permission';
  entityId: string;
  outletId?: string;
}

export interface PlatformPermissionRegistry {
  features: FeatureAuthority[];
  roles: RoleDelegation[];
  pages: PageAuthority[];
  navigationItems: PageAuthority[];
}
