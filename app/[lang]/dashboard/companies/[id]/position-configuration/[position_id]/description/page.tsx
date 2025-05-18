import { CreateManually } from "@/components/CreatePosition/CreateManually";
import { CreateDescriptionWithAI } from "@/components/CreatePosition/CreateDescriptionWithAI";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { PositionConfigurationTypes } from "@/types";

// We use this server component as a wrapper to be able to receive the lang attribute since it's a promise
export default async function DescriptionPage(props: {
  readonly params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ type?: PositionConfigurationTypes }>;
}) {
  const { lang } = await props.params;
  const { type } = await props.searchParams;

  const dictionary = await getDictionary(lang);
  switch (type) {
    case PositionConfigurationTypes.AI_TEMPLATE:
      return <CreateDescriptionWithAI dictionary={dictionary} />;
    case PositionConfigurationTypes.CUSTOM:
      return <CreateManually dictionary={dictionary} />;
    case PositionConfigurationTypes.OTHER_POSITION_AS_TEMPLATE:
      return <CreateDescriptionWithAI dictionary={dictionary} />;

    default:
      return <CreateDescriptionWithAI dictionary={dictionary} />;
  }
}
