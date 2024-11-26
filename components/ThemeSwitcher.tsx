"use client";

import { useTheme } from "@/lib/theme";

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <button
      className="bg-foreground text-background"
      onClick={() =>
        setTheme({ background: "240 10% 3.9%", foreground: "0 0% 98%" })
      }
    >
      SetTheme
    </button>
  );
}
