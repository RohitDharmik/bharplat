import { MenuItem, Table, TableStatus, UserRole, Order, OrderStatus, InventoryItem, Reservation, User, Feedback, Ticket, Purchase, SubscriptionPlan, AttendanceRecord, Customer } from './types';

export const MOCK_MENU: MenuItem[] = [
  {
    id: 'm1',
    name: 'Chila with Tomato Chutney',
    category: 'Starter',
    price: 120,
    description: 'Traditional Chhattisgarh rice flour crepes served with spicy tomato chutney.',
    image: 'https://images.unsplash.com/photo-1668236543090-d2f896b8643c?q=80&w=200',
    available: true
  },
  {
    id: 'm2',
    name: 'Fara (Steamed Dumplings)',
    category: 'Starter',
    price: 150,
    description: 'Steamed rice flour dumplings stir-fried with sesame seeds, curry leaves, and dried red chilies.',
    image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=200',
    available: true
  },
  {
    id: 'm3',
    name: 'Dubki Kadhi & Rice',
    category: 'Main',
    price: 240,
    description: 'Tangy yogurt curry with chickpea flour dumplings, served with steamed rice.',
    image: 'https://images.unsplash.com/photo-1626500609383-3635905085e6?q=80&w=200',
    available: true
  },
  {
    id: 'm4',
    name: 'Bafauri',
    category: 'Starter',
    price: 180,
    description: 'Healthy steamed chana dal bites, a lighter and healthier alternative to pakoras.',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=200',
    available: true
  },
  {
    id: 'm5',
    name: 'CG Style Chicken Curry',
    category: 'Main',
    price: 350,
    description: 'Spicy rustic chicken curry cooked with local spices and coriander.',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?q=80&w=200',
    available: true
  },
  {
    id: 'm6',
    name: 'Moong Dal Halwa',
    category: 'Dessert',
    price: 160,
    description: 'Rich lentil pudding cooked in ghee and garnished with roasted nuts.',
    image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?q=80&w=200',
    available: true
  },
  {
    id: 'm7',
    name: 'Masala Chai',
    category: 'Drink',
    price: 40,
    description: 'Traditional Indian tea brewed with spices and herbs.',
    image: 'https://images.unsplash.com/photo-1619054788167-d6921356241a?q=80&w=200',
    available: true
  },
  {
    id: 'm8',
    name: 'Sweet Lassi',
    category: 'Drink',
    price: 80,
    description: 'Chilled yogurt drink with rose water and cardamom.',
    image: 'https://images.unsplash.com/photo-1589734563813-f368fdfb6348?q=80&w=200',
    available: true
  }
];

export const INITIAL_TABLES: Table[] = Array.from({ length: 12 }, (_, i) => ({
  id: `t${i + 1}`,
  name: `Table ${i + 1}`,
  capacity: i % 2 === 0 ? 4 : 2,
  status: i === 2 ? TableStatus.OCCUPIED : i === 5 ? TableStatus.RESERVED : TableStatus.AVAILABLE,
  zone: i < 6 ? 'Main Hall' : 'Terrace'
}));

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1',
    tableId: 't3',
    items: [
      { menuItemId: 'm1', name: 'Chila with Tomato Chutney', quantity: 2, price: 120 },
      { menuItemId: 'm7', name: 'Masala Chai', quantity: 2, price: 40 }
    ],
    status: OrderStatus.PREPARING,
    totalAmount: 320,
    createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    updatedAt: new Date()
  }
];

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Rajesh Sahu', role: UserRole.SUPER_ADMIN, email: 'rajesh@bharplate.com', status: 'Active', lastActive: new Date() },
  { id: 'u2', name: 'Amit Baghel', role: UserRole.CHEF, email: 'amit@bharplate.com', status: 'Active', lastActive: new Date() },
  { id: 'u3', name: 'Priya Verma', role: UserRole.WAITER, email: 'priya@bharplate.com', status: 'Active', lastActive: new Date() },
  { id: 'u4', name: 'Suresh Patel', role: UserRole.MANAGER, email: 'suresh@bharplate.com', status: 'Active', lastActive: new Date() },
  { id: 'u5', name: 'Rahul Sharma', role: UserRole.COOK, email: 'rahul@bharplate.com', status: 'Active', lastActive: new Date() }
];

export const MOCK_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Rice Flour', quantity: 50, unit: 'kg', minThreshold: 10, category: 'Dry Goods', status: 'In Stock', lastUpdated: new Date() },
  { id: 'i2', name: 'Besan (Gram Flour)', quantity: 30, unit: 'kg', minThreshold: 5, category: 'Dry Goods', status: 'In Stock', lastUpdated: new Date() },
  { id: 'i3', name: 'Fresh Curd', quantity: 15, unit: 'kg', minThreshold: 5, category: 'Dairy', status: 'Low Stock', lastUpdated: new Date() },
  { id: 'i4', name: 'Chicken', quantity: 20, unit: 'kg', minThreshold: 8, category: 'Meat', status: 'In Stock', lastUpdated: new Date() },
  { id: 'i5', name: 'Tea Leaves', quantity: 2, unit: 'kg', minThreshold: 1, category: 'Dry Goods', status: 'Out of Stock', lastUpdated: new Date() },
];

export const MOCK_RESERVATIONS: Reservation[] = [
  { id: 'r1', customerName: 'Vikram Singh', customerPhone: '+91 98765 43210', date: new Date(Date.now() + 1000 * 60 * 60 * 2), guests: 6, status: 'Confirmed', assignedTableId: 't5' },
  { id: 'r2', customerName: 'Anjali Gupta', customerPhone: '+91 88776 65544', date: new Date(Date.now() + 1000 * 60 * 60 * 24), guests: 2, status: 'Pending' },
];

export const MOCK_FEEDBACK: Feedback[] = [
  { id: 'f1', customerName: 'Neha Agrawal', rating: 5, comment: 'The Dubki Kadhi reminded me of home. Absolutely delicious!', date: new Date(Date.now() - 1000 * 60 * 60 * 24), tableId: 't3' },
  { id: 'f2', customerName: 'Rohan Mehta', rating: 4, comment: 'Great Fara, but service was slightly slow during rush hour.', date: new Date(Date.now() - 1000 * 60 * 60 * 48), tableId: 't1' },
];

export const MOCK_TICKETS: Ticket[] = [
  { id: 'tk1', subject: 'Printer Connection Issue', category: 'Technical', description: 'Kitchen printer disconnects intermittently.', status: 'Pending', createdAt: new Date() },
  { id: 'tk2', subject: 'GST Calculation Error', category: 'Billing', description: 'Tax showing as 18% instead of 5%.', status: 'Resolved', createdAt: new Date(Date.now() - 86400000) }
];

export const MOCK_PURCHASES: Purchase[] = [
  { id: 'p1', date: new Date(), vendorName: 'Fresh Farms Ltd', totalAmount: 4500, status: 'Received', items: [{ name: 'Vegetables', quantity: 50, price: 4500 }] },
  { id: 'p2', date: new Date(Date.now() - 86400000 * 3), vendorName: 'City Dairy', totalAmount: 1200, status: 'Received', items: [{ name: 'Milk', quantity: 20, price: 1200 }] }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
    { id: 'a1', userId: 'u3', date: new Date(), status: 'Present', checkIn: '09:00 AM', checkOut: '06:00 PM' },
    { id: 'a2', userId: 'u5', date: new Date(), status: 'Present', checkIn: '10:00 AM' }
];

export const MOCK_CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'Vikram Singh', phone: '+91 98765 43210', email: 'vikram@example.com', visits: 5, totalSpent: 4500, lastVisit: new Date() },
    { id: 'c2', name: 'Anjali Gupta', phone: '+91 88776 65544', email: 'anjali@example.com', visits: 12, totalSpent: 15200, lastVisit: new Date(Date.now() - 86400000 * 5) }
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    { id: 'sp1', name: 'Basic', price: 999, validity: 'Monthly', features: ['Order Management', 'Digital Menu', 'Basic Reports'] },
    { id: 'sp2', name: 'Premium', price: 2499, validity: 'Monthly', features: ['All Basic Features', 'Inventory', 'Payroll', 'Advanced Reports', 'Priority Support'] },
    { id: 'sp3', name: 'Enterprise', price: 19999, validity: 'Yearly', features: ['All Premium Features', 'Multi-branch', 'API Access', 'Dedicated Manager'] }
];

export const NAV_ITEMS = {
  [UserRole.SUPER_ADMIN]: ['Dashboard', 'Users', 'Active Orders', 'Order History', 'Reports', 'Subscription', 'Tickets', 'Settings', 'Profile'],
  [UserRole.ADMIN]: ['Dashboard', 'Reservations', 'Tables', 'Active Orders', 'Order History', 'Menu', 'Inventory', 'Purchase', 'Recipes', 'Customers', 'Reports', 'QR Codes', 'Tickets', 'Settings', 'Profile'],
  [UserRole.MANAGER]: ['Dashboard', 'Tables', 'Reservations', 'Active Orders', 'Order History', 'Payments', 'Customers', 'Staff', 'Inventory', 'Purchase', 'Reports', 'Feedback', 'Tickets', 'Profile'],
  [UserRole.CHEF]: ['Kitchen Display', 'Menu Creator', 'Recipes', 'Inventory', 'Purchase', 'Profile'],
  [UserRole.COOK]: ['Kitchen Display', 'Inventory', 'Recipes', 'Profile'],
  [UserRole.WAITER]: ['Waiter Dashboard', 'My Tables', 'New Order', 'Reservations', 'Payments', 'Order History', 'Profile'],
  [UserRole.GUEST]: ['Menu', 'My Bill'],
};