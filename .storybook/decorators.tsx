import React from "react";
import { ReactRenderer, StoryContext } from "@storybook/react";
import { ThemeProvider, Theme, useTheme } from "@/lib/theme";
import { StoreProvider } from "@/lib/store/StoreProvider";

import type { PartialStoryFn as StoryFn } from "@storybook/types";

const themes: Record<string, Theme> = {
  light: {
    background: "0 0% 100%",
    foreground: "240 10% 3.9%",
    primary: "240 5.9% 10%",
    "primary-foreground": "0 0% 98%",
  },
  dark: {
    background: "240 10% 3.9%",
    foreground: "0 0% 98%",
    primary: "0 0% 90%",
    "primary-foreground": "240 10% 20%",
  },
  blue: {
    background: "220 60% 50%",
    foreground: "220 15% 15%",
    primary: "220 70% 40%",
    "primary-foreground": "220 20% 90%",
  },
  red: {
    background: "0 70% 50%",
    foreground: "0 15% 15%",
    primary: "0 80% 40%",
    "primary-foreground": "0 20% 90%",
  },
  green: {
    background: "120 50% 50%",
    foreground: "120 15% 15%",
    primary: "120 60% 40%",
    "primary-foreground": "120 20% 90%",
  },
  orange: {
    background: "30 90% 50%",
    foreground: "30 20% 15%",
    primary: "30 100% 40%",
    "primary-foreground": "30 25% 90%",
  },
};

export const withRedux = (
  Story: StoryFn<ReactRenderer>,
  context: StoryContext,
) => {
  return (
    <StoreProvider>
      <Story />
    </StoreProvider>
  );
};

export const withTheme = (
  Story: StoryFn<ReactRenderer>,
  context: StoryContext,
) => {
  const { theme } = context.globals;
  const selectedTheme = themes[theme] || themes.light;
  return (
    <ThemeProvider>
      {/* Apply the selected theme */}
      {React.createElement(() => {
        const { setTheme } = useTheme(); // Use your `useTheme` hook
        React.useEffect(() => {
          setTheme(selectedTheme);
        }, [selectedTheme, setTheme]);
        return <Story />;
      })}
    </ThemeProvider>
  );
};

export const globalDecorators = [withRedux, withTheme];
