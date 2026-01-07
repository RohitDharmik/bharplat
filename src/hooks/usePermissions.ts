// Custom hook for permission checking
import { useSuperAdmin } from './useSuperAdmin';
import { FeatureAuthority, PageAuthority, NavigationControl, UserRole } from '../types';

export const usePermissions = (userRole: UserRole) => {
  const { admins } = useSuperAdmin();

  // Mock current admin - in real app, get from auth context
  const currentAdmin = admins[0]; // For demo purposes

  const hasFeatureAuthority = (feature: FeatureAuthority): boolean => {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (!currentAdmin?.responsibilityMatrix) return false;
    return currentAdmin.responsibilityMatrix.featureAuthority[feature] ?? false;
  };

  const hasPageAuthority = (page: PageAuthority): boolean => {
    if (userRole === UserRole.SUPER_ADMIN) return true;
    if (!currentAdmin?.responsibilityMatrix) return false;
    return currentAdmin.responsibilityMatrix.pageAuthority[page] ?? false;
  };

  const getNavigationControl = (page: PageAuthority): NavigationControl => {
    if (userRole === UserRole.SUPER_ADMIN) return NavigationControl.SEE;
    if (!currentAdmin?.responsibilityMatrix) return NavigationControl.HIDE;
    return currentAdmin.responsibilityMatrix.navigationControl[page] ?? NavigationControl.HIDE;
  };

  return {
    hasFeatureAuthority,
    hasPageAuthority,
    getNavigationControl,
    canManageTickets: hasFeatureAuthority(FeatureAuthority.MANAGE_TICKETS),
    canManageSubscriptions: hasFeatureAuthority(FeatureAuthority.MANAGE_SUBSCRIPTIONS),
    canViewAuditLogs: hasFeatureAuthority(FeatureAuthority.VIEW_AUDIT_LOGS),
    canViewTickets: userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN || userRole === UserRole.SUB_ADMIN,
    canViewSubscriptions: userRole === UserRole.SUPER_ADMIN || userRole === UserRole.ADMIN
  };
};