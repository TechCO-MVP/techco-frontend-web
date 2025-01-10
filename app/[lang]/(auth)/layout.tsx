import { Text } from "@/components/Typography/Text";
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
  const { signUp, signIn, footer } = dictionary;

  return (
    <div className="relative flex h-full min-h-screen items-center justify-center bg-gray-50">
      <div
        className="min-h-100vh flex h-full min-h-screen w-full flex-col bg-gray-50"
        style={{
          backgroundImage: "url('/assets/background.jpeg')",
          backgroundBlendMode: "lighten",
          backgroundColor: "rgba(255,255,255,0.9)",
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
        <main className="mb-24 flex flex-1 items-center justify-center">
          {children}
        </main>
        <footer className="flex h-[60px] items-center justify-center bg-[#B3B3B3]">
          <Text size="small" type="p" color="#322F35">
            {footer.message}
          </Text>
        </footer>
      </div>
    </div>
  );
}
