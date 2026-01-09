import React from 'react';
import { StatCard } from '../ui/DashboardWidgets';
import { Users, UserCheck, UserX, Shield, MessageSquare, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminAccount } from '../../types';
import { useAppStore } from '../../store/useAppStore';

interface SuperAdminDashboardProps {
  admins: AdminAccount[];
  auditLogs: any[]; // from types
}

  const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ admins, auditLogs }) => {
  const { tickets, outletSubscriptions } = useAppStore();

  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(a => a.status === 'Active').length;
  const inactiveAdmins = totalAdmins - activeAdmins;

  // Ticket stats
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'Pending' || t.status === 'In Process').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

  // Subscription stats
  const activeSubscriptions = outletSubscriptions.filter(s => s.status === 'Active').length;
  const totalRevenue = outletSubscriptions
    .filter(s => s.status === 'Active')
    .reduce((sum, sub) => sum + 999, 0); // Mock calculation

  const recentLogs = auditLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-wide">Super Admin Governance</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-6">
        <StatCard title="Total Admins" value={totalAdmins.toString()} trend="+2" icon={<Users size={24} />} />
        <StatCard title="Active Admins" value={activeAdmins.toString()} trend="+1" icon={<UserCheck size={24} />} />
        <StatCard title="Inactive Admins" value={inactiveAdmins.toString()} trend="0" icon={<UserX size={24} />} />
        <StatCard title="Recent Changes" value={recentLogs.length.toString()} trend="+3" icon={<Shield size={24} />} />

        <StatCard title="Total Tickets" value={totalTickets.toString()} trend="+5" icon={<MessageSquare size={24} />} />
        <StatCard title="Open Tickets" value={openTickets.toString()} trend="+2" icon={<AlertCircle size={24} />} />
        <StatCard title="Resolved Tickets" value={resolvedTickets.toString()} trend="+3" icon={<CheckCircle size={24} />} />
        <StatCard title="Active Subscriptions" value={activeSubscriptions.toString()} trend="+1" icon={<CreditCard size={24} />} />
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Admin Activities</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-sm">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Admin</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {recentLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/5">
                  <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3 text-white">{log.performedBy}</td>
                  <td className="p-3">{log.action}</td>
                  <td className="p-3">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Admin Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-sm">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Outlet Scope</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Updated</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {admins.slice(0, 10).map((admin) => (
                <tr key={admin.id} className="border-b border-white/5">
                  <td className="p-3 text-white">{admin.name}</td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{admin.outletScope}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${admin.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(admin.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Ticket Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-sm">
                <th className="p-3">Subject</th>
                <th className="p-3">Category</th>
                <th className="p-3">Status</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Assigned To</th>
                <th className="p-3">Created</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {tickets.slice(0, 5).map((ticket) => (
                <tr key={ticket.id} className="border-b border-white/5">
                  <td className="p-3 text-white">{ticket.subject}</td>
                  <td className="p-3">{ticket.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      ticket.status === 'Resolved' ? 'text-green-400 bg-green-400/10' :
                      ticket.status === 'In Process' ? 'text-blue-400 bg-blue-400/10' :
                      'text-orange-400 bg-orange-400/10'
                    }`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="p-3">{ticket.priority}</td>
                  <td className="p-3">{ticket.assignedTo || 'Unassigned'}</td>
                  <td className="p-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Subscription Overview</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-sm">
                <th className="p-3">Outlet</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Status</th>
                <th className="p-3">Monthly Revenue</th>
                <th className="p-3">Next Billing</th>
                <th className="p-3">Auto Renew</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {outletSubscriptions.slice(0, 5).map((subscription) => (
                <tr key={subscription.id} className="border-b border-white/5">
                  <td className="p-3 text-white">{subscription.outletId}</td>
                  <td className="p-3">{subscription.planId}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      subscription.status === 'Active' ? 'text-green-400 bg-green-400/10' :
                      subscription.status === 'Expired' ? 'text-red-400 bg-red-400/10' :
                      'text-orange-400 bg-orange-400/10'
                    }`}>
                      {subscription.status}
                    </span>
                  </td>
                  <td className="p-3">₹999</td>
                  <td className="p-3">{subscription.endDate.toLocaleDateString()}</td>
                  <td className="p-3">{subscription.autoRenew ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SuperAdminDashboard;