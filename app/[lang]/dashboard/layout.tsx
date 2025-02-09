import { Locale } from "@/i18n-config";
import { TopBar } from "@/components/TopBar/TopBar";
import { SideBar } from "@/components/SideBar/SideBar";
import { getDictionary } from "@/get-dictionary";

interface DashboardLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lang: Locale }>;
}

export default async function DashboardLayout(
  props: Readonly<DashboardLayoutProps>,
) {
  const { children } = props;
  const { lang } = await props.params;
  const dictionary = await getDictionary(lang);
  return (
    <div className="relative flex h-full items-center justify-center bg-gray-50">
      <div className="flex h-full min-h-screen w-full flex-col bg-gray-50">
        <TopBar lang={lang} />
        <SideBar dictionary={dictionary} />
        <main className="mx-auto flex w-full max-w-[90%] flex-1 overflow-hidden py-4">
          {children}
        </main>
      </div>
    </div>
  );
}
