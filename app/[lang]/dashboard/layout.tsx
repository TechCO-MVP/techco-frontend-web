import { Locale } from "@/i18n-config";
import { TopBar } from "@/components/TopBar/TopBar";
import { SideBar } from "@/components/SideBar/SideBar";
import { getDictionary } from "@/get-dictionary";
import { WebSocketListener } from "@/components/WebSocketListener/WebSocketListener";
import { cookies } from "next/headers";
import { Text } from "@/components/Typography/Text";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function DashboardLayout(
  props: Readonly<DashboardLayoutProps>,
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  const { children } = props;
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  const { footer } = dictionary;

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="flex h-full w-full flex-1 flex-col bg-white">
        <TopBar lang={lang} />
        <SideBar dictionary={dictionary} />
        <WebSocketListener accessToken={accessToken} />
        <main className="mx-auto flex w-full max-w-[90%] flex-1">
          {children}
        </main>
        <footer className="flex h-[60px] items-center justify-center bg-talent-footer">
          <Text size="small" type="p" className="text-white">
            {footer.message}
          </Text>
        </footer>
      </div>
    </div>
  );
}
