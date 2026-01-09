import React, { useState } from 'react';
import { AdminAccount, OutletScope } from '../../types';
import { Modal } from '../ui/Modal';

interface AdminManagementProps {
  admins: AdminAccount[];
  onCreateAdmin: (admin: Omit<AdminAccount, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateAdmin: (id: string, updates: Partial<AdminAccount>) => void;
  onDeleteAdmin: (id: string) => void;
  onNavigateToConfig: (adminId: string) => void;
}

  const AdminManagement: React.FC<AdminManagementProps> = ({
  admins,
  onCreateAdmin,
  onUpdateAdmin,
  onDeleteAdmin,
  onNavigateToConfig
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    outletScope: OutletScope.SINGLE as OutletScope,
    status: 'Active' as 'Active' | 'Inactive'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAdmin) {
      onUpdateAdmin(editingAdmin.id, { ...formData, updatedAt: new Date() });
    } else {
      onCreateAdmin({
        ...formData,
        responsibilityMatrix: {
          featureAuthority: {} as any, // will be set in matrix editor
          roleDelegation: { canCreate: [], canAssignPermissions: [], canViewOnly: [] },
          pageAuthority: {} as any,
          navigationControl: {} as any
        }
      });
    }
    setIsModalOpen(false);
    setEditingAdmin(null);
    setFormData({ name: '', email: '', password: '', outletScope: OutletScope.SINGLE, status: 'Active' });
  };

  const openCreateModal = () => {
    setEditingAdmin(null);
    setFormData({ name: '', email: '', password: '', outletScope: OutletScope.SINGLE, status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (admin: AdminAccount) => {
    setEditingAdmin(admin);
    setFormData({
      name: admin.name,
      email: admin.email,
      password: '', // don't show password
      outletScope: admin.outletScope,
      status: admin.status
    });
    setIsModalOpen(true);
  };

  const toggleStatus = (admin: AdminAccount) => {
    onUpdateAdmin(admin.id, { status: admin.status === 'Active' ? 'Inactive' : 'Active', updatedAt: new Date() });
  };

  const getRoleType = (admin: AdminAccount) => {
    // Simple logic: if can manage users and reports, Full; else Limited
    const hasFullAccess = admin.responsibilityMatrix.featureAuthority['Can manage users'] &&
                         admin.responsibilityMatrix.featureAuthority['Can manage reports'];
    return hasFullAccess ? 'Full' : 'Limited';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-wide">Admin Management – Responsibility Overview</h3>
        <button
          onClick={openCreateModal}
          className="bg-gold-500 text-black px-4 py-2 rounded hover:bg-gold-600"
        >
          Create New Admin
        </button>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 text-neutral-400 text-sm">
                <th className="p-3">Admin Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Outlet Scope</th>
                <th className="p-3">Assigned Role Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {admins.map((admin) => (
                <tr key={admin.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="p-3 text-white cursor-pointer hover:text-gold-400" onClick={() => onNavigateToConfig(admin.id)}>
                    {admin.name}
                  </td>
                  <td className="p-3">{admin.email}</td>
                  <td className="p-3">{admin.outletScope}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs ${getRoleType(admin) === 'Full' ? 'text-green-400 bg-green-400/10' : 'text-yellow-400 bg-yellow-400/10'}`}>
                      {getRoleType(admin)}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded ${admin.status === 'Active' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {admin.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(admin.updatedAt).toLocaleDateString()}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => onNavigateToConfig(admin.id)}
                      className="text-blue-400 hover:underline"
                    >
                      View / Edit
                    </button>
                    <button
                      onClick={() => toggleStatus(admin)}
                      className={`hover:underline ${admin.status === 'Active' ? 'text-red-400' : 'text-green-400'}`}
                    >
                      {admin.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      onClick={() => onDeleteAdmin(admin.id)}
                      className="text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAdmin ? 'Edit Admin' : 'Create New Admin'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-2 bg-neutral-800 border border-white/10 rounded text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-2 bg-neutral-800 border border-white/10 rounded text-white"
              required
            />
          </div>
          {!editingAdmin && (
            <div>
              <label className="block text-sm font-medium text-white mb-1">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-2 bg-neutral-800 border border-white/10 rounded text-white"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-white mb-1">Outlet Scope</label>
            <select
              value={formData.outletScope}
              onChange={(e) => setFormData({ ...formData, outletScope: e.target.value as OutletScope })}
              className="w-full p-2 bg-neutral-800 border border-white/10 rounded text-white"
            >
              <option value={OutletScope.SINGLE}>Single Outlet</option>
              <option value={OutletScope.MULTI}>Multi-Outlet</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
              className="w-full p-2 bg-neutral-800 border border-white/10 rounded text-white"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gold-500 text-black rounded hover:bg-gold-600"
            >
              {editingAdmin ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default AdminManagement;