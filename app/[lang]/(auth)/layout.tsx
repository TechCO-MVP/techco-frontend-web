import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Link from "next/link";

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
      <div
        className="flex h-full w-full flex-col bg-gray-50"
        style={{
          background:
            "linear-gradient(rgba(255,255,255,.6), rgba(255,255,255,.6)), url('/assets/background.png')",
          backgroundBlendMode: "luminosity",
        }}
      >
        <header className="w-full p-4">
          <nav>
            <ul className="flex justify-end space-x-4">
              <li>
                <Link href="signin">
                  <Button className="rounded bg-background text-foreground hover:bg-foreground hover:text-background">
                    {signUp.signInLinkText}
                  </Button>
                </Link>
              </li>

              <li>
                <Link href="signup">
                  <Button className="rounded bg-background text-foreground hover:bg-foreground hover:text-background">
                    {signIn.createAccountLabel}
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex flex-1 items-center justify-center">
          {children}
        </main>
      </div>
    </div>
  );
}
