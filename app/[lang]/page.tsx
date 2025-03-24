import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import * as actions from "@/actions";
import { Button } from "@/components/ui/button";
export default async function IndexPage(props: {
  readonly params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-50">
      <div className="flex h-full w-full flex-col bg-gray-50">
        <header className="w-full p-4">
          <nav>
            <ul className="flex justify-end space-x-4">
              <li>
                <form action={actions.signOut}>
                  <input type="hidden" name="lang" value={lang} />
                  <Button variant="default" type="submit">
                    {dictionary["server-component"].logOut}
                  </Button>
                </form>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </div>
  );
}
