import { Text } from "@/components/Typography/Text";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import Image from "next/image";
import Link from "next/link";

interface SignUpLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function SignUpLayout(props: Readonly<SignUpLayoutProps>) {
  const { children, params } = props;
  const { lang } = await params;
  const dictionary = await getDictionary(lang);
  const { signUp, footer } = dictionary;

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
        <header className="w-full px-20 py-8">
          <nav className="flex items-center justify-between">
            <Image
              priority
              width={152}
              height={36}
              src="/assets/talent_connect.svg"
              alt="TechCo"
            />
            <ul className="flex justify-end space-x-4">
              <li>
                <Link href="signin">
                  <Button
                    variant="outline"
                    className="rounde-md text-talent-green-800 border-talent-green-800 hover:bg-talent-green-800 bg-transparent hover:text-white"
                  >
                    {signUp.signInLinkText}
                  </Button>
                </Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="mb-24 flex flex-1 items-center justify-center">
          {children}
        </main>
        <footer className="bg-talent-footer flex h-[60px] items-center justify-center">
          <Text size="small" type="p" className="text-white">
            {footer.message}
          </Text>
        </footer>
      </div>
    </div>
  );
}
