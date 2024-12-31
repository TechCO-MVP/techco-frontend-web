import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";
import { TopBar } from "@/components/TopBar/TopBar";
interface SignUpLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function SignUpLayout(props: Readonly<SignUpLayoutProps>) {
  const { children, params } = props;
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { signUp, signIn } = dictionary;

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-50">
      <div className="flex h-full w-full flex-col bg-gray-50">
        <TopBar />
        <main className="mx-auto flex w-full max-w-[90%] flex-1 overflow-hidden py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
