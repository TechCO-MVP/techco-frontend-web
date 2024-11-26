import { getDictionary } from "@/get-dictionary";
import type { Locale } from "@/i18n-config";
import { StoryContext } from "@storybook/react";

export const localesLoader = async (context: StoryContext) => {
  const { locale } = context.globals;
  const dictionary = await getDictionary(locale as Locale);
  return {
    params: {
      lang: locale,
    },
    dictionary,
  };
};
