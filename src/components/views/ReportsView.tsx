import React from 'react';
import { RevenueChart, OccupancyChart, StatCard } from '../ui/DashboardWidgets';
import { Download, TrendingUp, Calendar } from 'lucide-react';

export const ReportsView: React.FC = () => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Analytics & Reports</h2>
          <p className="text-neutral-400 text-sm">Deep dive into your business performance</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 bg-neutral-800 border border-white/10 hover:bg-neutral-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Calendar size={16} />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-black px-4 py-2 rounded-lg font-semibold transition-colors">
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <RevenueChart />
         <OccupancyChart />
      </div>

      <div className="bg-neutral-900/60 border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Top Selling Items</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-neutral-600">0{i}</span>
                <div>
                   <p className="font-bold text-white">Truffle Risotto</p>
                   <p className="text-sm text-neutral-400">Main Course</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gold-400">342 Orders</p>
                <p className="text-xs text-green-400 flex items-center justify-end gap-1">
                  <TrendingUp size={12} /> +12%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};