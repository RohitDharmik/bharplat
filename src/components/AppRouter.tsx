
import React, { useState, Suspense, lazy } from "react";
import QRCode from "react-qr-code";
import { UserRole, Table, OrderStatus, TableStatus } from "../types";
import { useAppStore } from "../store/useAppStore";
import { useSuperAdmin } from "../hooks/useSuperAdmin";
import { GuestTableSelection } from "./views/components/GuestTableSelection";
import  GuestMenu  from "./views/components/GuestMenu";
import { GuestBill } from "./views/components/GuestBill";
import { LoadingSpinner } from "./views/components/LoadingSpinner";

// Lazy load all heavy components
  
const TableMap = lazy(() => import("./views/TableMap"));
const KitchenDisplay = lazy(() => import("./views/KitchenDisplay"));
const MenuManager = lazy(() => import("./views/MenuManager"));
const UsersView = lazy(() => import("./views/UsersView"));
const InventoryView = lazy(() => import("./views/InventoryView"));
const ReservationsView = lazy(() => import("./views/ReservationsView"));
const NewOrderView = lazy(() => import("./views/NewOrderView"));
const OrderBillingView = lazy(() => import("./views/OrderBillingView"));
const PaymentsView = lazy(() => import("./views/PaymentsView"));
const PaymentHistoryView = lazy(() => import("./views/PaymentHistoryView"));
const ActiveOrdersView = lazy(() => import("./views/ActiveOrdersView"));
const SettingsView = lazy(() => import("./views/SettingsView"));
const ReportsView = lazy(() => import("./views/ReportsView"));
const FeedbackView = lazy(() => import("./views/FeedbackView"));
const WaiterView = lazy(() => import("./views/WaiterView"));
const DashboardView = lazy(() => import("./views/DashboardView"));
const TicketsView = lazy(() => import("./views/TicketsView"));
const SubscriptionView = lazy(() => import("./views/SubscriptionView"));
const RecipeView = lazy(() => import("./views/RecipeView"));
const PurchaseView = lazy(() => import("./views/PurchaseView"));
const CustomersView = lazy(() => import("./views/CustomersView"));
const QRCodeManagerView = lazy(() => import("./views/QRCodeManagerView"));
const ProfileView = lazy(() => import("./views/ProfileView"));
const SuperAdminDashboard = lazy(() => import("./views/SuperAdminDashboard"));
const AdminManagement = lazy(() => import("./views/AdminManagement"));
const AdminResponsibilityMatrixEditor = lazy(() => import("./views/AdminResponsibilityMatrixEditor"));
const RoutePageControlPanel = lazy(() => import("./views/RoutePageControlPanel"));
const PlatformPermissionRegistry = lazy(() => import("./views/PlatformPermissionRegistry"));
const AuditLog = lazy(() => import("./views/AuditLog"));
const AreaMaster = lazy(() => import("./views/AreaMaster"));
const TableMaster = lazy(() => import("./views/TableMaster"));

interface AppRouterProps {
  currentPage: string;
  userRole: UserRole;
  selectedTableId: string;
  onTableClick: (table: Table) => void;
  onPlaceOrder: (tableId: string, items: any[]) => Promise<void>;
  onProcessPayment: (orderId: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  currentPage,
  userRole,
  selectedTableId,
  onTableClick,
  onPlaceOrder,
  onProcessPayment,
  onUpdateOrderStatus,
}) => {
  const { tables, orders, guestTableId } = useAppStore();
  const superAdminHook = useSuperAdmin();
  const [selectedAdminId, setSelectedAdminId] = React.useState<string | null>(
    null
  );
  const [routeControlSelectedAdminId, setRouteControlSelectedAdminId] = React.useState<string | null>(
    null
  );

  const handleRouteControlTogglePage = (page: any, enabled: boolean) => {
    if (routeControlSelectedAdminId) {
      const admin = superAdminHook.admins.find(a => a.id === routeControlSelectedAdminId);
      if (admin) {
        const updatedMatrix = {
          ...admin.responsibilityMatrix,
          pageAuthority: {
            ...admin.responsibilityMatrix.pageAuthority,
            [page]: enabled
          }
        };
        superAdminHook.updateResponsibilityMatrix(routeControlSelectedAdminId, updatedMatrix);
      }
    }
  };

  // Super Admin Flow Logic
  if (userRole === UserRole.SUPER_ADMIN) {
    const validSuperAdminPages = [
      "Super Admin Dashboard",
      "Admin Management",
      "Admin Responsibility Matrix",
      "Route & Page Control",
      "Platform Permission Registry",
      "Audit Log",
      "Ticket Management",
      "Subscription Management",
      "Area Master",
      "Table Master"
    ];

    const pageToShow = validSuperAdminPages.includes(currentPage)
      ? currentPage
      : "Super Admin Dashboard";

    switch (pageToShow) {
      case "Super Admin Dashboard":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SuperAdminDashboard
              admins={superAdminHook.admins}
              auditLogs={superAdminHook.auditLogs}
            />
          </Suspense>
        );

      case "Admin Management":
        if (selectedAdminId) {
          const admin = superAdminHook.admins.find(
            (a) => a.id === selectedAdminId
          );
          return admin ? (
            <Suspense fallback={<LoadingSpinner />}>
              <AdminResponsibilityMatrixEditor
                admin={admin}
                onUpdateMatrix={superAdminHook.updateResponsibilityMatrix}
                onBack={() => setSelectedAdminId(null)}
              />
            </Suspense>
          ) : (
            <div>Admin not found</div>
          );
        } else {
          return (
            <Suspense fallback={<LoadingSpinner />}>
              <AdminManagement
                admins={superAdminHook.admins}
                onCreateAdmin={superAdminHook.createAdmin}
                onUpdateAdmin={superAdminHook.updateAdmin}
                onDeleteAdmin={superAdminHook.deleteAdmin}
                onNavigateToConfig={setSelectedAdminId}
              />
            </Suspense>
          );
        }

      case "Admin Responsibility Matrix":
        // For simplicity, show editor for first admin or a selector
        const firstAdmin = superAdminHook.admins[0]; // In real app, have a selector
        return firstAdmin ? (
          <Suspense fallback={<LoadingSpinner />}>
            <AdminResponsibilityMatrixEditor
              onBack={() => {}}
              admin={firstAdmin}
              onUpdateMatrix={superAdminHook.updateResponsibilityMatrix}
            />
          </Suspense>
        ) : (
          <div className="text-white">
            No admins to edit. Create an admin first.
          </div>
        );

      case "Route & Page Control":
        const selectedAdmin = routeControlSelectedAdminId ? superAdminHook.admins.find(a => a.id === routeControlSelectedAdminId) : null;
        const enabledPagesForAdmin = selectedAdmin ? Object.keys(selectedAdmin.responsibilityMatrix.pageAuthority).filter(page => selectedAdmin.responsibilityMatrix.pageAuthority[page as any]) as any[] : [];
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <RoutePageControlPanel
              admins={superAdminHook.admins}
              selectedAdminId={routeControlSelectedAdminId}
              onSelectAdmin={setRouteControlSelectedAdminId}
              availablePages={superAdminHook.availablePages}
              enabledPages={enabledPagesForAdmin}
              onTogglePage={handleRouteControlTogglePage}
              onAddPage={superAdminHook.addPage}
              onRemovePage={superAdminHook.removePage}
            />
          </Suspense>
        );

      case "Platform Permission Registry":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <PlatformPermissionRegistry registry={superAdminHook.registry} />
          </Suspense>
        );

      case "Audit Log":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AuditLog logs={superAdminHook.auditLogs} />
          </Suspense>
        );
      case "Ticket Management":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TicketsView userRole={userRole} />
          </Suspense>
        );
      case "Subscription Management":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SubscriptionView userRole={userRole} />
          </Suspense>
        );
      case "Area Master":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <AreaMaster />
          </Suspense>
        );
      case "Table Master":
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <TableMaster />
          </Suspense>
        );

      default:
        return (
          <Suspense fallback={<LoadingSpinner />}>
            <SuperAdminDashboard
              admins={superAdminHook.admins}
              auditLogs={superAdminHook.auditLogs}
            />
          </Suspense>
        );
    }
  }

  // Guest Flow Logic
  if (userRole === UserRole.GUEST) {
    if (!guestTableId) {
      return <GuestTableSelection />;
    }
    if (currentPage === "Menu") return <GuestMenu />;
    if (currentPage === "My Bill") return <GuestBill />;
    // Fallback for guest
    return <GuestMenu />;
  }

  // List of valid staff pages
  const validStaffPages = [
    "Dashboard",
    "Tables",
    "Floor Plan",
    "My Tables",
    "Kitchen Display",
    "Menu",
    "Menu Creator",
    "Users",
    "Staff",
    "Inventory",
    "Reservations",
    "New Order",
    "Order & Billing",
    "Payments",
    "Order History",
    "Payment History",
    "Active Orders",
    "Settings",
    "Reports",
    "Feedback",
    "Tickets",
    "Subscription",
    "Recipes",
    "Purchase",
    "Customers",
    "QR Codes",
    "Profile",
    "Waiter Dashboard",
    "Area Master",
    "Table Master",
  ];

  // If currentPage is not valid, default to Dashboard
  const pageToShow = validStaffPages.includes(currentPage)
    ? currentPage
    : "Dashboard";

  // Existing Staff Flow
  switch (pageToShow) {
    case "Dashboard":
      return (
        <Suspense fallback={<LoadingSpinner />}>
          <DashboardView userRole={userRole} />
        </Suspense>
      );

    case "Tables":
    case "Floor Plan":
    case "My Tables":
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Floor Plan
            </h2>
            <div className="flex space-x-2 text-sm">
              <span className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                Available
              </span>
              <span className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                Occupied
              </span>
              <span className="flex items-center text-neutral-600 dark:text-neutral-400">
                <span className="w-3 h-3 rounded-full bg-gold-500 mr-2"></span>
                Reserved
              </span>
            </div>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <TableMap tables={tables} onTableClick={onTableClick} />
          </Suspense>
        </div>
      );

    case "Kitchen Display":
      return (
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Kitchen Display System
            </h2>
            <span className="text-gold-600 dark:text-gold-400 font-mono text-xl">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <KitchenDisplay
              orders={orders}
              onUpdateStatus={onUpdateOrderStatus}
            />
          </Suspense>
        </div>
      );

    case "Menu":
    case "Menu Creator":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <MenuManager />
          </Suspense>
        </div>
      );

    case "Users":
    case "Staff":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <UsersView currentUserRole={userRole} />
          </Suspense>
        </div>
      );

    case "Inventory":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <InventoryView />
          </Suspense>
        </div>
      );

    case "Reservations":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <ReservationsView />
          </Suspense>
        </div>
      );

    case "New Order":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <NewOrderView
              onPlaceOrder={onPlaceOrder}
              initialTableId={selectedTableId}
            />
          </Suspense>
        </div>
      );

    case "Order & Billing":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <OrderBillingView
              initialTableId={selectedTableId}
            />
          </Suspense>
        </div>
      );

    case "Payments":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentsView
              orders={orders}
              tables={tables}
              onProcessPayment={onProcessPayment}
            />
          </Suspense>
        </div>
      );

    case "Order History":
    case "Payment History":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <PaymentHistoryView
              orders={orders}
              tables={tables}
              title={currentPage}
            />
          </Suspense>
        </div>
      );

    case "Active Orders":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <ActiveOrdersView orders={orders} tables={tables} />
          </Suspense>
        </div>
      );

    case "Settings":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <SettingsView />
          </Suspense>
        </div>
      );

    case "Reports":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <ReportsView />
          </Suspense>
        </div>
      );

    case "Feedback":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <FeedbackView />
          </Suspense>
        </div>
      );

    case "Tickets":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <TicketsView userRole={userRole} />
          </Suspense>
        </div>
      );

    case "Subscription":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <SubscriptionView userRole={userRole} />
          </Suspense>
        </div>
      );

    case "Recipes":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <RecipeView />
          </Suspense>
        </div>
      );

    case "Purchase":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <PurchaseView />
          </Suspense>
        </div>
      );

    case "Customers":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <CustomersView />
          </Suspense>
        </div>
      );

    case "QR Codes":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <QRCodeManagerView />
          </Suspense>
        </div>
      );

    case "Profile":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <ProfileView />
          </Suspense>
        </div>
      );

    case "Waiter Dashboard":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <WaiterView
              tables={tables}
              orders={orders}
              onTableClick={onTableClick}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          </Suspense>
        </div>
      );

    case "Area Master":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <AreaMaster />
          </Suspense>
        </div>
      );

    case "Table Master":
      return (
        <div className="animate-in fade-in duration-500">
          <Suspense fallback={<LoadingSpinner />}>
            <TableMaster />
          </Suspense>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center h-96 text-neutral-500">
          <h2 className="text-xl font-semibold mb-2">Work in Progress</h2>
          <p>The {currentPage} module is currently under development.</p>
        </div>
      );
  }
};
