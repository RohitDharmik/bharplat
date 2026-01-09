import React, { useEffect, useState } from 'react';
import { UserRole, OrderStatus } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useApi } from '../../hooks/useApi';
import { StatCard, RevenueChart, OccupancyChart } from '../ui/DashboardWidgets';
import { ShoppingBag, Users, Activity, IndianRupee } from 'lucide-react';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { ResponsiveContainer, ResponsiveGrid } from '../ui/ResponsiveGrid';
import { SuspenseWrapper } from '../ui/SuspenseWrapper';

interface DashboardViewProps {
  userRole: UserRole;
}

  const DashboardView: React.FC<DashboardViewProps> = ({ userRole }) => {
  const { orders } = useAppStore();
  const { getReports } = useApi();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch dashboard data from API
        // const data = await getReports({ dashboard: true });
        // setDashboardData(data);
        console.log('DashboardView: Ready to fetch data from API using axiosInstance');
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [getReports]);

  if (userRole === UserRole.SUPER_ADMIN) {
      return (
          <SuspenseWrapper>
              <ResponsiveContainer maxWidth="7xl">
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Super Admin Console</h2>
                  <SuperAdminDashboard admins={[]} auditLogs={[]} />
              </ResponsiveContainer>
          </SuspenseWrapper>
      );
  }

  return (
    <SuspenseWrapper>
      <ResponsiveContainer maxWidth="7xl">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Welcome back, {userRole}</h2>
        
        {/* Responsive Grid: 1 col mobile, 2 col tablet, 4 col desktop */}
        <ResponsiveGrid 
          columns={{ mobile: 1, tablet: 2, desktop: 4, largeDesktop: 4 }}
          gap="6"
          className="mb-8"
        >
          <StatCard title="Total Revenue" value="₹45,250" trend="+12%" icon={<IndianRupee size={20} />} />
          <StatCard title="Active Orders" value={`${orders.filter(item => item.status !== OrderStatus.PAID).length}`} trend="+5%" icon={<ShoppingBag size={20} />} />
          <StatCard title="Occupancy" value="78%" trend="+2%" icon={<Users size={20} />} />
          <StatCard title="Avg. Wait Time" value="18m" trend="-4%" icon={<Activity size={20} />} />
        </ResponsiveGrid>
        
        {/* Responsive Grid: 1 col mobile, 2 col desktop */}
        <ResponsiveGrid 
          columns={{ mobile: 1, tablet: 1, desktop: 2, largeDesktop: 2 }}
          gap="6"
          className="mb-8"
        >
          <RevenueChart />
          <OccupancyChart />
        </ResponsiveGrid>

        <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-white/5 rounded-xl p-6 shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Live Activity Log</h3>
            <div className="space-y-4">
              {[1,2,3].map((_, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-neutral-100 dark:border-white/5 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-gold-600 dark:text-gold-500">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-900 dark:text-white font-medium">Table 4 - Order Placed</p>
                      <p className="text-xs text-neutral-500">2 minutes ago by Waiter Priya</p>
                    </div>
                  </div>
                  <span className="text-xs text-gold-600 dark:text-gold-500 font-mono">₹450.00</span>
                </div>
              ))}
            </div>
          </div>
      </ResponsiveContainer>
    </SuspenseWrapper>
  );
};
export default  DashboardView;