import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { SignInForm } from "@/components/SignInForm/SignInForm";
import { Board } from "@/components/Board/Board";

// We use this server component as a wrapper to be able to receive the lang attribute since it's a promise
export default async function SignIn(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  return <Board />;
  // To handle the form, we use the "useActionState" hook, this means the SignUpPage needs to be a "client" component
  // return <SignInForm dictionary={dictionary} />;
}
