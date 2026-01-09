import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ChefHat,
  Coffee,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  CreditCard,
  FileBarChart,
  CalendarCheck,
  Grid,
  Sun,
  Moon,
  ClipboardList,
  History,
  ListOrdered,
  Receipt,
  ScanLine,
  Ticket,
  Zap,
  BookOpen,
  ShoppingBasket,
  QrCode,
  UserCircle,
  Package,
  MessageSquare,
  Shield,
  MapPin,
  Table
} from 'lucide-react';
import { UserRole } from '../../types';
import { NAV_ITEMS } from '../../constants';

interface LayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const getIcon = (item: string) => {
  switch (item) {
    case 'Dashboard': return <LayoutDashboard size={20} />;
    case 'Waiter Dashboard': return <ClipboardList size={20} />;
    case 'Users': 
    case 'Staff': 
    case 'Customers': return <Users size={20} />;
    case 'Reports': return <FileBarChart size={20} />;
    case 'Settings': return <Settings size={20} />;
    case 'Reservations': return <CalendarCheck size={20} />;
    case 'Tables': 
    case 'Floor Plan': 
    case 'My Tables': return <Grid size={20} />;
    case 'Menu': 
    case 'Menu Creator': return <UtensilsCrossed size={20} />;
    case 'Kitchen Display': return <ChefHat size={20} />;
    case 'New Order': return <Coffee size={20} />;
    case 'Payments': return <CreditCard size={20} />;
    case 'Active Orders': return <ListOrdered size={20} />;
    case 'Order History': 
    case 'Payment History': return <History size={20} />;
    case 'My Bill': return <Receipt size={20} />;
    case 'Tickets': return <Ticket size={20} />;
    case 'Subscription': return <Zap size={20} />;
    case 'Recipes': return <BookOpen size={20} />;
    case 'Purchase': return <ShoppingBasket size={20} />;
    case 'QR Codes': return <QrCode size={20} />;
    case 'Profile': return <UserCircle size={20} />;
    case 'Inventory': return <Package size={20} />;
    case 'Feedback': return <MessageSquare size={20} />;
    case 'Super Admin Dashboard': return <LayoutDashboard size={20} />;
    case 'Admin Management': return <Users size={20} />;
    case 'Admin Responsibility Matrix': return <Grid size={20} />;
    case 'Route & Page Control': return <Settings size={20} />;
    case 'Platform Permission Registry': return <Shield size={20} />;
    case 'Audit Log': return <FileBarChart size={20} />;
    case 'Area Master': return <MapPin size={20} />;
    case 'Table Master': return <Table size={20} />;
    default: return <Grid size={20} />;
  }
};

export const Layout: React.FC<LayoutProps> = ({ children, userRole, onLogout, currentPage, onNavigate, isDarkMode, toggleTheme }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Use the NAV_ITEMS constant
  const navItems = NAV_ITEMS[userRole] || ['Dashboard'];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-neutral-200 flex overflow-hidden font-sans transition-colors duration-300">
      
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-neutral-50 dark:bg-[#121212] border-r border-neutral-200 dark:border-primary-600/20
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-neutral-200 dark:border-primary-600/10 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gold-500 to-gold-600 bg-clip-text text-transparent">
                BharPlate
              </h1>
              <p className="text-xs text-gold-600/80 dark:text-gold-500/60 uppercase tracking-widest">Enterprise</p>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-neutral-500 dark:text-neutral-400">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 py-6 space-y-1 px-3 overflow-y-auto custom-scrollbar">
            <div className="mb-6 px-3">
              <div className="p-4 bg-white dark:bg-gradient-to-br dark:from-neutral-800 dark:to-neutral-900 rounded-xl border border-neutral-200 dark:border-primary-600/10 shadow-sm dark:shadow-none">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">Logged in as</p>
                <p className="font-semibold text-gold-600 dark:text-gold-400">{userRole === 'Waiter' ? 'Captain' : userRole}</p>
              </div>
            </div>

            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  onNavigate(item);
                  setIsSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${currentPage === item
                   ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 shadow-sm'
                   : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'}
                `}
              >
                {getIcon(item)}
                <span className="font-medium">{item}</span>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-neutral-200 dark:border-gold-600/10">
            <button 
              onClick={onLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 border-b border-neutral-200 dark:border-gold-600/10 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-neutral-500 dark:text-neutral-400">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4 ml-auto">
             <button
              onClick={toggleTheme}
              className="p-2 text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="relative p-2 text-neutral-500 dark:text-neutral-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-400 to-primary-600 p-[1px]">
              <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center text-xs font-bold text-primary-600 dark:text-primary-500">
                {userRole[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative">
           <div className="max-w-7xl mx-auto space-y-6">
             {children}
           </div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-50 dark:opacity-100">
            <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-primary-600/5 blur-[120px]"></div>
            <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-900/5 blur-[120px]"></div>
        </div>
      </main>
    </div>
  );
};