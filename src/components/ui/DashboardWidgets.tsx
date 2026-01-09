import React from 'react';
import { ResponsiveContainer } from './ResponsiveGrid';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  return (
    <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
          <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-1">{value}</p>
          {trend && (
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">{trend}</p>
          )}
        </div>
        <div className="text-gold-600 dark:text-gold-500">
          {icon}
        </div>
      </div>
    </div>
  );
};

export const RevenueChart: React.FC = () => {
  const data = [
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2780 },
    { name: 'May', revenue: 1890 },
    { name: 'Jun', revenue: 2390 },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Revenue Trend</h3>
      <ResponsiveContainer maxWidth="none" padding={false}>
        <div className="h-64 bg-gradient-to-r from-gold-50 to-white dark:from-neutral-900 dark:to-neutral-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-gold-600 dark:text-gold-400">₹45,250</div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Total Revenue</p>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
};

export const OccupancyChart: React.FC = () => {
  const data = [
    { name: 'Available', value: 40, color: '#10b981' },
    { name: 'Occupied', value: 35, color: '#ef4444' },
    { name: 'Reserved', value: 15, color: '#f59e0b' },
    { name: 'Dirty', value: 10, color: '#f97316' },
  ];

  return (
    <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-white/10 rounded-xl p-6 shadow-sm dark:shadow-none">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Table Occupancy</h3>
      <ResponsiveContainer maxWidth="none" padding={false}>
        <div className="h-64 grid grid-cols-2 gap-4">
          {data.map((item, index) => (
            <div key={index} className="bg-white dark:bg-neutral-800 rounded-lg p-4 shadow-sm border border-neutral-200 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-neutral-900 dark:text-white">{item.name}</span>
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
              </div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-white">{item.value}%</div>
            </div>
          ))}
        </div>
      </ResponsiveContainer>
    </div>
  );
};