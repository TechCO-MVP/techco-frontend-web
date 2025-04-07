"use client";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store/StoreProvider";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { NotificationProvider } from "@/lib/notification-provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <ThemeProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </ThemeProvider>
      </StoreProvider>
    </QueryClientProvider>
  );
}
