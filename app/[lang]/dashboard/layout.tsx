import { Locale } from "@/i18n-config";
import { TopBar } from "@/components/TopBar/TopBar";
import { SideBar } from "@/components/SideBar/SideBar";
import { getDictionary } from "@/get-dictionary";
import { WebSocketListener } from "@/components/WebSocketListener/WebSocketListener";
import { cookies } from "next/headers";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function DashboardLayout(
  props: Readonly<DashboardLayoutProps>,
) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const webSocketBaseUrl = process.env.WEBSOCKET_URL as string;
  const webSocketConnectionUrl = `${webSocketBaseUrl}?token=${accessToken}`;
  console.log(
    "%c[Debug] webSocketConnectionUrl",
    "background-color: teal; font-size: 20px; color: white",
    webSocketConnectionUrl,
  );
  const { children } = props;
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);

  return (
    <div className="relative flex h-full items-center justify-center bg-gray-50">
      <div className="flex h-full min-h-screen w-full flex-col bg-white">
        <TopBar lang={lang} />
        <SideBar dictionary={dictionary} />
        <WebSocketListener webSocketUrl={webSocketConnectionUrl} />
        <main className="mx-auto flex w-full max-w-[90%] flex-1 overflow-hidden py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
