import React, { useState } from "react";
import QRCode from "react-qr-code";
import { UserRole, Table, OrderStatus, TableStatus } from "../types";
import { TableMap } from "./views/TableMap";
import { KitchenDisplay } from "./views/KitchenDisplay";
import { MenuManager } from "./views/MenuManager";
import { UsersView } from "./views/UsersView";
import { InventoryView } from "./views/InventoryView";
import { ReservationsView } from "./views/ReservationsView";
import { NewOrderView } from "./views/NewOrderView";
import { OrderBillingView } from "./views/OrderBillingView";
import { PaymentsView } from "./views/PaymentsView";
import { PaymentHistoryView } from "./views/PaymentHistoryView";
import { ActiveOrdersView } from "./views/ActiveOrdersView";
import { SettingsView } from "./views/SettingsView";
import { ReportsView } from "./views/ReportsView";
import { FeedbackView } from "./views/FeedbackView";
import { WaiterView } from "./views/WaiterView";
import { GuestTableSelection, GuestMenu, GuestBill } from "./views/GuestPortal";
import { DashboardView } from "./views/DashboardView";
import { TicketsView } from "./views/TicketsView";
import { SubscriptionView } from "./views/SubscriptionView";
import { RecipeView } from "./views/RecipeView";
import { PurchaseView } from "./views/PurchaseView";
import { CustomersView } from "./views/CustomersView";
import { QRCodeManagerView } from "./views/QRCodeManagerView";
import { ProfileView } from "./views/ProfileView";
import { SuperAdminDashboard } from "./views/SuperAdminDashboard";
import { AdminManagement } from "./views/AdminManagement";
import {
  AdminResponsibilityMatrixEditor as AdminResponsibilityConfig,
  AdminResponsibilityMatrixEditor,
} from "./views/AdminResponsibilityMatrixEditor";
import { RoutePageControlPanel } from "./views/RoutePageControlPanel";
import { PlatformPermissionRegistry } from "./views/PlatformPermissionRegistry";
import { AuditLog } from "./views/AuditLog";
import { AreaMaster } from "./views/AreaMaster";
import { TableMaster } from "./views/TableMaster";
import { useAppStore } from "../store/useAppStore";
import { useSuperAdmin } from "../hooks/useSuperAdmin";

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
          <SuperAdminDashboard
            admins={superAdminHook.admins}
            auditLogs={superAdminHook.auditLogs}
          />
        );

      case "Admin Management":
        if (selectedAdminId) {
          const admin = superAdminHook.admins.find(
            (a) => a.id === selectedAdminId
          );
          return admin ? (
            <AdminResponsibilityConfig
              admin={admin}
              onUpdateMatrix={superAdminHook.updateResponsibilityMatrix}
              onBack={() => setSelectedAdminId(null)}
            />
          ) : (
            <div>Admin not found</div>
          );
        } else {
          return (
            <AdminManagement
              admins={superAdminHook.admins}
              onCreateAdmin={superAdminHook.createAdmin}
              onUpdateAdmin={superAdminHook.updateAdmin}
              onDeleteAdmin={superAdminHook.deleteAdmin}
              onNavigateToConfig={setSelectedAdminId}
            />
          );
        }

      case "Admin Responsibility Matrix":
        // For simplicity, show editor for first admin or a selector
        const firstAdmin = superAdminHook.admins[0]; // In real app, have a selector
        return firstAdmin ? (
          <AdminResponsibilityMatrixEditor
            onBack={() => {}}
            admin={firstAdmin}
            onUpdateMatrix={superAdminHook.updateResponsibilityMatrix}
          />
        ) : (
          <div className="text-white">
            No admins to edit. Create an admin first.
          </div>
        );

      case "Route & Page Control":
        const selectedAdmin = routeControlSelectedAdminId ? superAdminHook.admins.find(a => a.id === routeControlSelectedAdminId) : null;
        const enabledPagesForAdmin = selectedAdmin ? Object.keys(selectedAdmin.responsibilityMatrix.pageAuthority).filter(page => selectedAdmin.responsibilityMatrix.pageAuthority[page as any]) as any[] : [];
        return (
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
        );

      case "Platform Permission Registry":
        return (
          <PlatformPermissionRegistry registry={superAdminHook.registry} />
        );

      case "Audit Log":
        return <AuditLog logs={superAdminHook.auditLogs} />;
      case "Ticket Management":
        return <TicketsView userRole={userRole} />;
      case "Subscription Management":
        return <SubscriptionView userRole={userRole} />;
      case "Area Master":
        return <AreaMaster />;
      case "Table Master":
        return <TableMaster />;

      default:
        return (
          <SuperAdminDashboard
            admins={superAdminHook.admins}
            auditLogs={superAdminHook.auditLogs}
          />
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
  console.log(pageToShow, "pageToShow");

  // Existing Staff Flow
  switch (pageToShow) {
    case "Dashboard":
      return <DashboardView userRole={userRole} />;

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
          <TableMap tables={tables} onTableClick={onTableClick} />
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
          <KitchenDisplay
            orders={orders}
            onUpdateStatus={onUpdateOrderStatus}
          />
        </div>
      );

    case "Menu":
    case "Menu Creator":
      return (
        <div className="animate-in fade-in duration-500">
          <MenuManager />
        </div>
      );

    case "Users":
    case "Staff":
      return (
        <div className="animate-in fade-in duration-500">
          <UsersView currentUserRole={userRole} />
        </div>
      );

    case "Inventory":
      return (
        <div className="animate-in fade-in duration-500">
          <InventoryView />
        </div>
      );

    case "Reservations":
      return (
        <div className="animate-in fade-in duration-500">
          <ReservationsView />
        </div>
      );

    case "New Order":
      return (
        <div className="animate-in fade-in duration-500">
          <NewOrderView
            onPlaceOrder={onPlaceOrder}
            initialTableId={selectedTableId}
          />
        </div>
      );

    case "Order & Billing":
      return (
        <div className="animate-in fade-in duration-500">
          <OrderBillingView
            initialTableId={selectedTableId}
          />
        </div>
      );

    case "Payments":
      return (
        <div className="animate-in fade-in duration-500">
          <PaymentsView
            orders={orders}
            tables={tables}
            onProcessPayment={onProcessPayment}
          />
        </div>
      );

    case "Order History":
    case "Payment History":
      return (
        <div className="animate-in fade-in duration-500">
          <PaymentHistoryView
            orders={orders}
            tables={tables}
            title={currentPage}
          />
        </div>
      );

    case "Active Orders":
      return (
        <div className="animate-in fade-in duration-500">
          <ActiveOrdersView orders={orders} tables={tables} />
        </div>
      );

    case "Settings":
      return (
        <div className="animate-in fade-in duration-500">
          <SettingsView />
        </div>
      );

    case "Reports":
      return (
        <div className="animate-in fade-in duration-500">
          <ReportsView />
        </div>
      );

    case "Feedback":
      return (
        <div className="animate-in fade-in duration-500">
          <FeedbackView />
        </div>
      );

    case "Tickets":
      return (
        <div className="animate-in fade-in duration-500">
          <TicketsView userRole={userRole} />
        </div>
      );

    case "Subscription":
      return (
        <div className="animate-in fade-in duration-500">
          <SubscriptionView userRole={userRole} />
        </div>
      );

    case "Recipes":
      return (
        <div className="animate-in fade-in duration-500">
          <RecipeView />
        </div>
      );

    case "Purchase":
      return (
        <div className="animate-in fade-in duration-500">
          <PurchaseView />
        </div>
      );

    case "Customers":
      return (
        <div className="animate-in fade-in duration-500">
          <CustomersView />
        </div>
      );

    case "QR Codes":
      return (
        <div className="animate-in fade-in duration-500">
          <QRCodeManagerView />
        </div>
      );

    case "Profile":
      return (
        <div className="animate-in fade-in duration-500">
          <ProfileView />
        </div>
      );

    case "Waiter Dashboard":
      return (
        <div className="animate-in fade-in duration-500">
          <WaiterView
            tables={tables}
            orders={orders}
            onTableClick={onTableClick}
            onUpdateOrderStatus={onUpdateOrderStatus}
          />
        </div>
      );

    case "Area Master":
      return (
        <div className="animate-in fade-in duration-500">
          <AreaMaster />
        </div>
      );

    case "Table Master":
      return (
        <div className="animate-in fade-in duration-500">
          <TableMaster />
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
