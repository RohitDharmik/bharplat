import { useState, useEffect } from 'react';
import { AdminAccount, AuditLogEntry, PlatformPermissionRegistry, PageAuthority, FeatureAuthority, RoleDelegation } from '../types';

export const useSuperAdmin = () => {
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [availablePages, setAvailablePages] = useState<PageAuthority[]>(Object.values(PageAuthority));
  const [enabledPages, setEnabledPages] = useState<PageAuthority[]>(Object.values(PageAuthority));

  const registry: PlatformPermissionRegistry = {
    features: Object.values(FeatureAuthority),
    roles: Object.values(RoleDelegation),
    pages: Object.values(PageAuthority),
    navigationItems: Object.values(PageAuthority)
  };

  // Load from localStorage or API
  useEffect(() => {
    const savedAdmins = localStorage.getItem('superAdmin_admins');
    const savedLogs = localStorage.getItem('superAdmin_auditLogs');
    const savedAvailablePages = localStorage.getItem('superAdmin_availablePages');
    const savedEnabledPages = localStorage.getItem('superAdmin_enabledPages');

    if (savedAdmins) setAdmins(JSON.parse(savedAdmins));
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
    if (savedAvailablePages) setAvailablePages(JSON.parse(savedAvailablePages));
    if (savedEnabledPages) setEnabledPages(JSON.parse(savedEnabledPages));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('superAdmin_admins', JSON.stringify(admins));
  }, [admins]);

  useEffect(() => {
    localStorage.setItem('superAdmin_auditLogs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('superAdmin_availablePages', JSON.stringify(availablePages));
  }, [availablePages]);

  useEffect(() => {
    localStorage.setItem('superAdmin_enabledPages', JSON.stringify(enabledPages));
  }, [enabledPages]);

  const logAction = (action: string, details: string, adminId?: string, entityType: 'ticket' | 'subscription' | 'admin' | 'permission' = 'admin', entityId?: string, outletId?: string) => {
    const log: AuditLogEntry = {
      id: Date.now().toString(),
      adminId: adminId || '',
      action,
      details,
      timestamp: new Date(),
      performedBy: 'Super Admin', // In real app, get from auth
      entityType,
      entityId: entityId || adminId || '',
      outletId
    };
    setAuditLogs(prev => [log, ...prev]);
  };

  const createAdmin = (adminData: Omit<AdminAccount, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAdmin: AdminAccount = {
      ...adminData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setAdmins(prev => [...prev, newAdmin]);
    logAction('Create Admin', `Created admin ${newAdmin.name}`, newAdmin.id);
  };

  const updateAdmin = (id: string, updates: Partial<AdminAccount>) => {
    setAdmins(prev => prev.map(admin =>
      admin.id === id ? { ...admin, ...updates, updatedAt: new Date() } : admin
    ));
    const admin = admins.find(a => a.id === id);
    if (admin) {
      logAction('Update Admin', `Updated admin ${admin.name}`, id);
    }
  };

  const deleteAdmin = (id: string) => {
    const admin = admins.find(a => a.id === id);
    setAdmins(prev => prev.filter(a => a.id !== id));
    if (admin) {
      logAction('Delete Admin', `Deleted admin ${admin.name}`, id);
    }
  };

  const updateResponsibilityMatrix = (adminId: string, matrix: any) => {
    updateAdmin(adminId, { responsibilityMatrix: matrix });
    const admin = admins.find(a => a.id === adminId);
    if (admin) {
      logAction('Update Responsibility Matrix', `Updated permissions for admin ${admin.name}`, adminId);
    }
  };

  const togglePage = (page: PageAuthority, enabled: boolean) => {
    setEnabledPages(prev => enabled ? [...prev, page] : prev.filter(p => p !== page));
    logAction('Toggle Page', `${enabled ? 'Enabled' : 'Disabled'} page ${page}`);
  };

  const addPage = (page: PageAuthority) => {
    setAvailablePages(prev => [...prev, page]);
    logAction('Add Page', `Added page ${page} to registry`);
  };

  const removePage = (page: PageAuthority) => {
    setAvailablePages(prev => prev.filter(p => p !== page));
    setEnabledPages(prev => prev.filter(p => p !== page));
    logAction('Remove Page', `Removed page ${page} from registry`);
  };

  // Governance Rules Enforcement
  const canAdminAccessPage = (admin: AdminAccount, page: PageAuthority): boolean => {
    return admin.responsibilityMatrix.pageAuthority[page] || false;
  };

  const canAdminManageFeature = (admin: AdminAccount, feature: FeatureAuthority): boolean => {
    return admin.responsibilityMatrix.featureAuthority[feature] || false;
  };

  const canAdminCreateRole = (admin: AdminAccount, role: RoleDelegation): boolean => {
    return admin.responsibilityMatrix.roleDelegation.canCreate.includes(role);
  };

  return {
    admins,
    auditLogs,
    availablePages,
    enabledPages,
    registry,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    updateResponsibilityMatrix,
    togglePage,
    addPage,
    removePage,
    canAdminAccessPage,
    canAdminManageFeature,
    canAdminCreateRole
  };
};