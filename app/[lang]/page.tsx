import Counter from "@/components/Counter";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";

export default async function IndexPage(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  return (
    <div className="grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20">
      <div>
        <p>Current locale: {lang}</p>
        <p>
          This text is rendered on the server:{" "}
          {dictionary["server-component"].welcome}
        </p>
        <Counter dictionary={dictionary} />
      </div>
    </div>
  );
}
