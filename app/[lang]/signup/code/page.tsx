import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { OTPForm } from "@/components/OTPForm/OTPForm";

export default async function OTPPage(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  return <OTPForm dictionary={dictionary} />;
}
