import React, { Suspense } from "react";
import { useAppStore } from "../../store/useAppStore";
import { GuestTableSelection } from "./components/GuestTableSelection";
import { GuestMenu } from "./components/GuestMenu";
import { GuestBill } from "./components/GuestBill";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { SuspenseWrapper } from "../ui/SuspenseWrapper";

export const GuestPortal: React.FC = () => {
  const { guestTableId } = useAppStore();

  return (
    <SuspenseWrapper>
      <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <Suspense fallback={<LoadingSpinner />}>
          {guestTableId ? <GuestMenu /> : <GuestTableSelection />}
        </Suspense>
      </div>
    </SuspenseWrapper>
  );
};
