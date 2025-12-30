import { AlertModal } from "@/components/uikit/alertModal";
import { ReactNode } from "react";

export const LogoutModal = ({
  onLogoutHandler,
  children,
}: {
  onLogoutHandler: () => void;
  children: ReactNode;
}) => {
  return (
    <AlertModal
      title="Sure About Signing Out?"
      description="Are you sure you want to sign out? You'll need to log in again to access your account"
      actionButtonText="Yes, Logout"
      actionButtonClassName="bg-red-600"
      cancelButtonText="Cancel"
      onAction={onLogoutHandler}
    >
      {children}
    </AlertModal>
  );
};
