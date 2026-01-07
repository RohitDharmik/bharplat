import React from 'react';
import { Shield } from 'lucide-react';
import { usePermissions } from '../../hooks/usePermissions';
import { FeatureAuthority, PageAuthority, UserRole } from '../../types';

interface PermissionGuardProps {
  children: React.ReactNode;
  userRole: UserRole;
  feature?: FeatureAuthority;
  page?: PageAuthority;
  requireAll?: boolean; // If true, requires both feature and page permissions
  fallback?: React.ReactNode;
}

// Higher-order component for permission guarding
export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  userRole,
  feature,
  page,
  requireAll = false,
  fallback
}) => {
  const permissions = usePermissions(userRole);

  let hasPermission = false;

  if (requireAll) {
    hasPermission = (!feature || permissions.hasFeatureAuthority(feature)) &&
                   (!page || permissions.hasPageAuthority(page));
  } else {
    hasPermission = (!feature || permissions.hasFeatureAuthority(feature)) ||
                   (!page || permissions.hasPageAuthority(page));
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="text-center p-8 text-neutral-500">
        <Shield className="mx-auto mb-4 h-12 w-12" />
        <h3 className="text-lg font-medium">Access Denied</h3>
        <p>You don't have permission to access this feature.</p>
      </div>
    );
  }

  return <>{children}</>;
};

// Convenience components for common permission checks
export const TicketManagementGuard: React.FC<{
  children: React.ReactNode;
  userRole: UserRole;
  fallback?: React.ReactNode;
}> = ({ children, userRole, fallback }) => (
  <PermissionGuard
    userRole={userRole}
    feature={FeatureAuthority.MANAGE_TICKETS}
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

export const SubscriptionManagementGuard: React.FC<{
  children: React.ReactNode;
  userRole: UserRole;
  fallback?: React.ReactNode;
}> = ({ children, userRole, fallback }) => (
  <PermissionGuard
    userRole={userRole}
    feature={FeatureAuthority.MANAGE_SUBSCRIPTIONS}
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);

export const AuditLogGuard: React.FC<{
  children: React.ReactNode;
  userRole: UserRole;
  fallback?: React.ReactNode;
}> = ({ children, userRole, fallback }) => (
  <PermissionGuard
    userRole={userRole}
    feature={FeatureAuthority.VIEW_AUDIT_LOGS}
    fallback={fallback}
  >
    {children}
  </PermissionGuard>
);