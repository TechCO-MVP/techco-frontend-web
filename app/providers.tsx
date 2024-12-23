"use client";
import { ThemeProvider } from "@/lib/theme";
import { StoreProvider } from "@/lib/store/StoreProvider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <StoreProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </StoreProvider>
  );
}
