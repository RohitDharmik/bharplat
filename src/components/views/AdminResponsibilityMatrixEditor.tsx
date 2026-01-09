import React, { useState } from 'react';
import { AdminAccount, FeatureAuthority, RoleDelegation, PageAuthority, NavigationControl, ResponsibilityMatrix } from '../../types';

interface AdminResponsibilityMatrixEditorProps {
  admin: AdminAccount;
  onUpdateMatrix: (adminId: string, matrix: ResponsibilityMatrix) => void;
  onBack: () => void;
}

  const AdminResponsibilityMatrixEditor: React.FC<AdminResponsibilityMatrixEditorProps> = ({
  admin,
  onUpdateMatrix,
  onBack
}) => {
  const [matrix, setMatrix] = useState<ResponsibilityMatrix>(admin.responsibilityMatrix);

  const handleFeatureChange = (feature: FeatureAuthority, value: boolean) => {
    setMatrix(prev => ({
      ...prev,
      featureAuthority: { ...prev.featureAuthority, [feature]: value }
    }));
  };

  const handleRoleDelegationChange = (type: keyof ResponsibilityMatrix['roleDelegation'], role: RoleDelegation, checked: boolean) => {
    setMatrix(prev => ({
      ...prev,
      roleDelegation: {
        ...prev.roleDelegation,
        [type]: checked
          ? [...prev.roleDelegation[type], role]
          : prev.roleDelegation[type].filter(r => r !== role)
      }
    }));
  };

  const handlePageAuthorityChange = (page: PageAuthority, value: boolean) => {
    setMatrix(prev => ({
      ...prev,
      pageAuthority: { ...prev.pageAuthority, [page]: value }
    }));
  };

  const handleNavigationControlChange = (page: PageAuthority, control: NavigationControl) => {
    setMatrix(prev => ({
      ...prev,
      navigationControl: { ...prev.navigationControl, [page]: control }
    }));
  };

  const handleSave = () => {
    onUpdateMatrix(admin.id, matrix);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-wide">
          Admin Responsibility Configuration
        </h3>
        <button
          onClick={onBack}
          className="bg-neutral-700 text-white px-4 py-2 rounded hover:bg-neutral-600"
        >
          ← Back to Admin List
        </button>
      </div>

      {/* Admin Identity */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Admin Identity</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Name</label>
            <p className="text-white font-medium">{admin.name}</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Email</label>
            <p className="text-white">{admin.email}</p>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1">Outlet Scope</label>
            <p className="text-white">{admin.outletScope}</p>
          </div>
        </div>
      </div>

      {/* Section A: Feature Control */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Section A: Feature Control</h4>
        <p className="text-neutral-400 mb-4">Configure which restaurant features this Admin can manage</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(FeatureAuthority).map(feature => (
            <label key={feature} className="flex items-center space-x-3 p-3 bg-neutral-800/50 rounded">
              <input
                type="checkbox"
                checked={matrix.featureAuthority[feature] || false}
                onChange={(e) => handleFeatureChange(feature, e.target.checked)}
                className="form-checkbox h-5 w-5"
              />
              <span className="text-white">{feature}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Section B: Page & Route Access */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Section B: Page & Route Access</h4>
        <p className="text-neutral-400 mb-4">Control which pages this Admin can access and modify</p>
        <div className="space-y-3">
          {Object.values(PageAuthority).map(page => (
            <div key={page} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded">
              <span className="text-white font-medium">{page}</span>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={matrix.pageAuthority[page] || false}
                    onChange={(e) => handlePageAuthorityChange(page, e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="text-neutral-300">View</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(matrix.pageAuthority[page] && matrix.navigationControl[page] === NavigationControl.ENABLE) || false}
                    onChange={(e) => handleNavigationControlChange(page, e.target.checked ? NavigationControl.ENABLE : NavigationControl.SEE)}
                    className="form-checkbox"
                  />
                  <span className="text-neutral-300">Edit</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section C: Navigation Visibility Control */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Section C: Navigation Visibility Control</h4>
        <p className="text-neutral-400 mb-4">Control sidebar navigation visibility. Rule: Admin can only expose navigation they themselves can see</p>
        <div className="space-y-3">
          {Object.values(PageAuthority).map(page => (
            <div key={page} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded">
              <span className="text-white font-medium">{page}</span>
              <select
                value={matrix.navigationControl[page] || NavigationControl.SEE}
                onChange={(e) => handleNavigationControlChange(page, e.target.value as NavigationControl)}
                className="p-2 bg-neutral-700 border border-white/10 rounded text-white"
                disabled={!matrix.pageAuthority[page]}
              >
                <option value={NavigationControl.SEE}>Visible</option>
                <option value={NavigationControl.ENABLE}>Enable for others</option>
                <option value={NavigationControl.HIDE}>Hidden</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: Role Delegation Authority */}
      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Section D: Role Delegation Authority</h4>
        <p className="text-neutral-400 mb-4">Define which roles this Admin can create, edit, or view</p>
        <div className="space-y-6">
          {Object.values(RoleDelegation).map(role => (
            <div key={role} className="p-4 bg-neutral-800/50 rounded">
              <h5 className="text-white font-medium mb-3">{role}</h5>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={matrix.roleDelegation.canCreate.includes(role)}
                    onChange={(e) => handleRoleDelegationChange('canCreate', role, e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="text-neutral-300">Can Create</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={matrix.roleDelegation.canAssignPermissions.includes(role)}
                    onChange={(e) => handleRoleDelegationChange('canAssignPermissions', role, e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="text-neutral-300">Can Edit</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={matrix.roleDelegation.canViewOnly.includes(role)}
                    onChange={(e) => handleRoleDelegationChange('canViewOnly', role, e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="text-neutral-300">Can View Only</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onBack}
          className="px-6 py-2 bg-neutral-700 text-white rounded hover:bg-neutral-600"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="bg-gold-500 text-black px-6 py-2 rounded hover:bg-gold-600"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};export default AdminResponsibilityMatrixEditor;