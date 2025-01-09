import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { OTPSignUpForm } from "@/components/OTPSignUpForm/OTPSignUpForm";

export default async function OTPSignUpPage(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  return <OTPSignUpForm dictionary={dictionary} />;
}
