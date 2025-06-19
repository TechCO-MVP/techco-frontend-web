import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import {
  NotificationProvider,
  useNotification,
} from "@/lib/notification-provider";
import React, { useEffect } from "react";

// Mock the NotificationDialog component to simplify the test
vi.mock("@/components/ui/notification", () => ({
  NotificationDialog: ({ show, onClose, title, description }: any) => {
    return show ? (
      <div>
        <div>{title}</div>
        <div>{description}</div>
        <button onClick={onClose}>Close</button>
      </div>
    ) : null;
  },
}));

describe("NotificationProvider", () => {
  let originalError: any;

  beforeEach(() => {
    originalError = console.error;
    console.error = vi.fn(); // silence expected React errors
  });

  afterEach(() => {
    console.error = originalError;
  });

  it("throws an error when useNotification is used outside the provider", () => {
    const TestComponent = () => {
      useNotification();
      return null;
    };

    expect(() => render(<TestComponent />)).toThrow(
      "useNotification must be used within a NotificationProvider",
    );
  });

  it("shows and hides a notification correctly", async () => {
    const TestComponent = () => {
      const { showNotification } = useNotification();

      useEffect(() => {
        showNotification({
          title: "Success",
          description: "Notification sent",
        });
      }, [showNotification]);

      return <div>Test</div>;
    };

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );

    expect(await screen.findByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Notification sent")).toBeInTheDocument();

    // Simulate close
    act(() => {
      screen.getByText("Close").click();
    });

    // Wait for timeout to hide it
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 350));
    });

    expect(screen.queryByText("Success")).not.toBeInTheDocument();
  });
});
