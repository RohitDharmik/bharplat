import React from 'react';
import { PlatformPermissionRegistry as RegistryType, FeatureAuthority, RoleDelegation, PageAuthority } from '../../types';

interface PlatformPermissionRegistryProps {
  registry: RegistryType;
}

  const PlatformPermissionRegistry: React.FC<PlatformPermissionRegistryProps> = ({ registry }) => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-neutral-400 uppercase tracking-wide">Platform Permission Registry</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Feature Authorities</h4>
          <ul className="space-y-2">
            {registry.features.map(feature => (
              <li key={feature} className="text-neutral-300 flex items-center">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3"></span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Role Delegations</h4>
          <ul className="space-y-2">
            {registry.roles.map(role => (
              <li key={role} className="text-neutral-300 flex items-center">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3"></span>
                {role}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Page Authorities</h4>
          <ul className="space-y-2">
            {registry.pages.map(page => (
              <li key={page} className="text-neutral-300 flex items-center">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3"></span>
                {page}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Navigation Items</h4>
          <ul className="space-y-2">
            {registry.navigationItems.map(item => (
              <li key={item} className="text-neutral-300 flex items-center">
                <span className="w-2 h-2 bg-gold-500 rounded-full mr-3"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-neutral-900/60 backdrop-blur-md border border-white/5 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Permission Model Principles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-neutral-400">
          <div>
            <h5 className="text-white mb-2">Data-driven</h5>
            <p>All permissions are stored in structured data, not hardcoded.</p>
          </div>
          <div>
            <h5 className="text-white mb-2">Hierarchical</h5>
            <p>Super Admin → Admin → Other Roles. No upward permission flow.</p>
          </div>
          <div>
            <h5 className="text-white mb-2">Non-overridable</h5>
            <p>Admins cannot override Super Admin settings.</p>
          </div>
          <div>
            <h5 className="text-white mb-2">Auditable</h5>
            <p>All permission changes are logged and tracked.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlatformPermissionRegistry;