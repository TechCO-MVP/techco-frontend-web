import { CopyDescription } from "@/components/CreatePosition/CopyDescription";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

// We use this server component as a wrapper to be able to receive the lang attribute since it's a promise
export default async function CopyDescriptionPage(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  return <CopyDescription dictionary={dictionary} />;
}
