import React, { useState, useEffect } from 'react';
import { ConfigProvider, theme, Spin } from 'antd';
import { Layout } from './components/ui/Layout';
import { LoginScreen } from './components/views/LoginScreen';
import { AppRouter } from './components/AppRouter';
import { AdminTableModal } from './components/ui/AdminTableModal';
import { UserRole, TableStatus, OrderStatus, Table } from './types';
import { useAppStore } from './store/useAppStore';
import { LoadingOutlined } from '@ant-design/icons';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

const App = () => {
  // Performance monitoring
  usePerformanceMonitor();

  // State
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState<string>('');

  // Admin Table Modal State
  const [isAdminTableModalOpen, setIsAdminTableModalOpen] = useState(false);
  const [activeAdminTable, setActiveAdminTable] = useState<Table | null>(null);

  // Store Hooks
  const {
    placeOrder,
    updateOrderStatus,
    updateTableStatus,
    fetchInitialData,
    isLoading,
    isInitialized
  } = useAppStore();

  // Initial Data Fetch
  useEffect(() => {
    fetchInitialData();
  }, []);

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator && import.meta.env.MODE === 'production') {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  // Effects
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
      if (userRole === UserRole.GUEST) {
          setCurrentPage('Menu');
      }
  }, [userRole]);

  // Reset selected table when leaving order page
  useEffect(() => {
    if (currentPage !== 'New Order') {
      setSelectedTableId('');
    }
  }, [currentPage]);

  // Handlers
  const handleTableClick = async (table: Table) => {
    if (userRole === UserRole.WAITER) {
      setSelectedTableId(table.id);
      setCurrentPage('New Order');
      if (table.status === TableStatus.AVAILABLE) {
         await updateTableStatus(table.id, TableStatus.OCCUPIED);
      }
      return;
    }

    // For Admins/Managers/etc, open detailed modal
    setActiveAdminTable(table);
    setIsAdminTableModalOpen(true);
  };

  const handleAdminTableStatusChange = async (status: TableStatus) => {
    if (activeAdminTable) {
        await updateTableStatus(activeAdminTable.id, status);
        setActiveAdminTable({ ...activeAdminTable, status }); // Optimistic update for modal
    }
  };

  const handlePlaceOrder = async (tableId: string, items: any[]) => {
    await placeOrder(tableId, items);
    if (selectedTableId) {
      setCurrentPage('My Tables');
    }
  };

  const handleProcessPayment = async (orderId: string) => {
     await updateOrderStatus(orderId, OrderStatus.PAID);
  };

  // Login View
  if (!userRole) {
    return <LoginScreen onLogin={setUserRole} />;
  }

  // Global Loader
  if (!isInitialized && isLoading) {
      return (
          <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-gold-500 gap-4">
              <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#D4AF37' }} spin />} />
              <p className="font-bold tracking-wider animate-pulse">INITIALIZING BHARPLATE...</p>
          </div>
      );
  }

  // Main App View
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#D4AF37', // Gold
        },
      }}
    >
      <Layout
        userRole={userRole}
        onLogout={() => setUserRole(null)}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
      >
        <AppRouter
          currentPage={currentPage}
          userRole={userRole}
          selectedTableId={selectedTableId}
          onTableClick={handleTableClick}
          onPlaceOrder={handlePlaceOrder}
          onProcessPayment={handleProcessPayment}
          onUpdateOrderStatus={updateOrderStatus}
        />
      </Layout>

      <AdminTableModal
        table={activeAdminTable}
        isOpen={isAdminTableModalOpen}
        onClose={() => setIsAdminTableModalOpen(false)}
        onStatusChange={handleAdminTableStatusChange}
      />
    </ConfigProvider>
  );
};

export default App;