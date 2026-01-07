import React, { useState } from 'react';
import { PageAuthority, AdminAccount } from '../../types';

interface RoutePageControlPanelProps {
  admins: AdminAccount[];
  selectedAdminId: string | null;
  onSelectAdmin: (id: string) => void;
  availablePages: PageAuthority[];
  enabledPages: PageAuthority[];
  onTogglePage: (page: PageAuthority, enabled: boolean) => void;
  onAddPage: (page: PageAuthority) => void;
  onRemovePage: (page: PageAuthority) => void;
}

export const RoutePageControlPanel: React.FC<RoutePageControlPanelProps> = ({
  admins,
  selectedAdminId,
  onSelectAdmin,
  availablePages,
  enabledPages,
  onTogglePage,
  onAddPage,
  onRemovePage
}) => {
  const [newPage, setNewPage] = useState('');

  const handleAddPage = () => {
    if (newPage && !availablePages.includes(newPage as PageAuthority)) {
      onAddPage(newPage as PageAuthority);
      setNewPage('');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-wide">Route & Page Control Panel</h3>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Select Admin</h4>
        <p className="text-neutral-400 mb-4">
          Choose an admin to manage page access for. All subsequent operations will apply to the selected admin.
        </p>
        <select
          value={selectedAdminId || ''}
          onChange={(e) => onSelectAdmin(e.target.value)}
          className="w-full p-2 bg-neutral-800 border border-white/10 rounded text-white"
        >
          <option value="">Select an Admin</option>
          {admins.map(admin => (
            <option key={admin.id} value={admin.id}>{admin.name} ({admin.email})</option>
          ))}
        </select>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Global Page Registry</h4>
        <p className="text-neutral-400 mb-4">
          Manage the global list of available pages in the system. Super Admin owns the route registry.
        </p>

        <div className="flex space-x-2 mb-4">
          <input
            type="text"
            value={newPage}
            onChange={(e) => setNewPage(e.target.value)}
            placeholder="New Page Name"
            className="flex-1 p-2 bg-neutral-800 border border-white/10 rounded text-white"
          />
          <button
            onClick={handleAddPage}
            className="bg-gold-500 text-black px-4 py-2 rounded hover:bg-gold-600"
          >
            Add Page
          </button>
        </div>

        <div className="space-y-2">
          {availablePages.map(page => (
            <div key={page} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded">
              <span className="text-white">{page}</span>
              <div className="flex items-center space-x-2">
                {selectedAdminId && (
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={enabledPages.includes(page)}
                      onChange={(e) => onTogglePage(page, e.target.checked)}
                      className="form-checkbox"
                    />
                    <span className="text-neutral-400">Enabled for Admin</span>
                  </label>
                )}
                <button
                  onClick={() => onRemovePage(page)}
                  className="text-red-400 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedAdminId && (
        <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Admin Page Access Summary</h4>
          <p className="text-neutral-400 mb-4">
            Current page access status for the selected admin.
          </p>
          <div className="text-white">
            Enabled Pages: {enabledPages.length} / {availablePages.length}
          </div>
        </div>
      )}

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Route Governance Rules</h4>
        <ul className="text-neutral-400 space-y-2">
          <li>• Super Admin owns the global route registry</li>
          <li>• Admins can only enable/disable routes within their assigned scope</li>
          <li>• Cannot create new system routes</li>
          <li>• Cannot expose restricted routes</li>
          <li>• Route changes are audited</li>
        </ul>
      </div>
    </div>
  );
};