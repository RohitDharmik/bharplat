import React, { useState } from 'react';
import { AuditLogEntry } from '../../types';
import { Filter, MessageSquare, CreditCard, Shield, Users } from 'lucide-react';

interface AuditLogProps {
  logs: AuditLogEntry[];
}

  const AuditLog: React.FC<AuditLogProps> = ({ logs }) => {
  const [filter, setFilter] = useState<string>('all');

  const filteredLogs = filter === 'all' ? logs : logs.filter(log => log.entityType === filter);

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'ticket': return <MessageSquare size={16} className="text-blue-500" />;
      case 'subscription': return <CreditCard size={16} className="text-green-500" />;
      case 'admin': return <Users size={16} className="text-purple-500" />;
      case 'permission': return <Shield size={16} className="text-orange-500" />;
      default: return <Shield size={16} className="text-gray-500" />;
    }
  };

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'ticket': return 'text-blue-400 bg-blue-400/10';
      case 'subscription': return 'text-green-400 bg-green-400/10';
      case 'admin': return 'text-purple-400 bg-purple-400/10';
      case 'permission': return 'text-orange-400 bg-orange-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-wide">Audit Log</h3>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-neutral-400" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-neutral-800 border border-white/10 rounded px-3 py-1 text-white text-sm"
          >
            <option value="all">All Events</option>
            <option value="ticket">Tickets</option>
            <option value="subscription">Subscriptions</option>
            <option value="admin">Admin Changes</option>
            <option value="permission">Permissions</option>
          </select>
        </div>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Admin Changes History</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-sm">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Entity</th>
                <th className="p-3">Action</th>
                <th className="p-3">Details</th>
                <th className="p-3">Performed By</th>
                <th className="p-3">Target</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="border-b border-white/5">
                  <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {getEntityIcon(log.entityType)}
                      <span className={`px-2 py-1 rounded text-xs ${getEntityColor(log.entityType)}`}>
                        {log.entityType}
                      </span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-blue-400/10 text-blue-400">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3">{log.details}</td>
                  <td className="p-3 text-white">{log.performedBy}</td>
                  <td className="p-3 text-white">{log.entityId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Audit Principles</h4>
        <ul className="text-neutral-400 space-y-2">
          <li>• All Super Admin actions are logged</li>
          <li>• Logs are immutable and tamper-proof</li>
          <li>• Used for compliance and troubleshooting</li>
          <li>• Retention policy: 7 years</li>
          <li>• Accessible only to Super Admin</li>
        </ul>
      </div>
    </div>
  );
};
export default AuditLog;