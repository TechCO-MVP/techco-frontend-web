import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { OpeningTracking } from "@/components/OpeningTracking/OpeningTracking";

// We use this server component as a wrapper to be able to receive the lang attribute since it's a promise
export default async function CompaniesPage(props: {
  readonly params: Promise<{ lang: Locale; id: string }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  return <OpeningTracking dictionary={dictionary} />;
}
