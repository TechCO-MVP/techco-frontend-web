import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AboutCompanyTab } from "@/components/AboutCompanyTab/AboutCompanyTab";
import { UserSettingsTab } from "@/components/UserSettingsTab/UserSettingsTab";
import { BackButton } from "@/components/BackButton/BackButton";

// We use this server component as a wrapper to be able to receive the lang attribute since it's a promise
export default async function CompaniesPage(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  return (
    <div className="flex w-full flex-col gap-8">
      <nav>
        <BackButton dictionary={dictionary} />
      </nav>
      <Tabs
        defaultValue="about"
        className="flex h-full w-full flex-col items-center justify-center bg-white"
      >
        <TabsList className="min-w-full justify-start rounded-none border-b-[1px] bg-white">
          <TabsTrigger
            className="rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            value="about"
          >
            {dictionary.companiesPage.aboutCompanyTabTitle}
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-black shadow-none data-[state=active]:border-b-2 data-[state=active]:shadow-none"
            value="user"
          >
            {dictionary.companiesPage.userSettingsTabTitle}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="about" className="h-full w-full max-w-screen-lg">
          <AboutCompanyTab dictionary={dictionary} />
        </TabsContent>
        <TabsContent value="user" className="h-full w-full max-w-screen-lg">
          <UserSettingsTab dictionary={dictionary} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
