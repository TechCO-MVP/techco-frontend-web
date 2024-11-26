"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";

export interface Theme {
  background?: string;
  foreground?: string;
  primary?: string;
  "primary-foreground"?: string;
}

interface ThemeContextValue {
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const setTheme = useCallback((theme: Theme) => {
    Object.entries(theme).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value);
    });
  }, []);

  const contexValue = useMemo(() => ({ setTheme }), [setTheme]);

  return (
    <ThemeContext.Provider value={contexValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
