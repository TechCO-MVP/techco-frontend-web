import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { WalkthroughDialog } from "@/components/WalkthroughDialog/WalkthroughDialog";
export default async function IndexPage(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);
  const { homePage: i18n } = dictionary;
  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-50">
      <div className="flex h-full w-full flex-col bg-gray-50">
        <div className="flex flex-col items-center justify-center">
          <WalkthroughDialog closeLabel={i18n.closeModalLabel} />
        </div>
      </div>
    </div>
  );
}
