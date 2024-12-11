import "@/app/[lang]/globals.css";
import type { Preview } from "@storybook/react";
import { localesLoader } from "@/.storybook/loaders/localesLoader";
import { globalDecorators } from "./decorators";
export const globalTypes = {
  locale: {
    name: "Locale",
    description: "Internationalization locale",
    defaultValue: "es",
    toolbar: {
      icon: "globe",
      items: [
        { value: "en", title: "English" },
        { value: "es", title: "Español" },
      ],
      showName: true,
    },
  },
  theme: {
    name: "Theme",
    description: "Theme selection",
    defaultValue: "light",
    toolbar: {
      icon: "paintbrush",
      items: ["light", "dark", "green", "blue", "red", "orange"],
    },
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  loaders: [localesLoader],
  decorators: globalDecorators,
};

export default preview;
