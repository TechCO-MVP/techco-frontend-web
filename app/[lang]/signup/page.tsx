import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { SignUpForm } from "@/components/SignUpForm/SignUpForm";

// We use this server component as a wrapper to be able to receive the lang attribute since it's a promise
export default async function SignUp(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  // To handle the form, we use the "useActionState" hook, this means the SignUpPage needs to be a "client" component
  return <SignUpForm dictionary={dictionary} />;
}
