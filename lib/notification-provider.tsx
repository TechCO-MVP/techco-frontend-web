"use client";

import type React from "react";
import { createContext, useContext, useState, useCallback } from "react";
import {
  NotificationDialog,
  type NotificationProps,
} from "@/components/ui/notification";

type NotificationOptions = Omit<NotificationProps, "show" | "onClose">;

type NotificationContextType = {
  showNotification: (options: NotificationOptions) => void;
  hideNotification: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notification, setNotification] = useState<NotificationOptions | null>(
    null,
  );
  const [show, setShow] = useState(false);

  const showNotification = useCallback((options: NotificationOptions) => {
    setNotification(options);
    setShow(true);
  }, []);

  const hideNotification = useCallback(() => {
    setShow(false);
    // Remove notification data after animation completes
    setTimeout(() => {
      setNotification(null);
    }, 300);
  }, []);

  return (
    <NotificationContext.Provider
      value={{ showNotification, hideNotification }}
    >
      {children}
      {notification && (
        <NotificationDialog
          show={show}
          onClose={hideNotification}
          {...notification}
        />
      )}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
