import { Button } from "@/components/ui/button";
import Image from "next/image";
import { apiEndpoints } from "@/lib/api-endpoints";
import { countryNameLookup } from "@/lib/utils";
import Link from "next/link";
import { PositionResponse } from "@/types";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { CancelApplicationDialog } from "@/components/CancelApplicationDialog/CancelApplicationDialog";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale; company_name: string; vacancy_name: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { vacancy_name, company_name, lang } = await params;

  const dictionary = await getDictionary(lang);
  const { positionOfferPage: i18n } = dictionary;
  const { token } = await searchParams;
  if (!token) return <p>Missing token</p>;
  const response = await fetch(apiEndpoints.positionDetails(token), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.API_KEY ?? "",
    },
  });
  if (!response.ok) {
    return <p>Failed to fetch position details</p>;
  }

  const position: PositionResponse = await response.json();
  const {
    body: { data: positionData },
  } = position;

  return (
    <>
      <div className="relative flex h-full min-h-screen items-center justify-center bg-gray-50">
        <div
          className="min-h-100vh flex h-full min-h-screen w-full flex-col justify-center bg-gray-50"
          style={{
            backgroundImage: "url('/assets/background.jpeg')",
            backgroundBlendMode: "lighten",
            backgroundColor: "rgba(255,255,255,0.8)",
          }}
        >
          <div className="mx-auto flex h-[85vh] w-[85vw] flex-col items-center justify-center bg-white px-4 py-12 text-center">
            <div className="mb-8">
              <Image
                src="/assets/logo.png"
                alt={company_name}
                width={64}
                height={64}
                className="mx-auto"
              />
            </div>

            <div className="mb-6 space-y-1 text-sm text-muted-foreground">
              <p className="uppercase tracking-wide">
                <span>{positionData.position_city}</span>
                <span className="mx-2">•</span>
                <span>{countryNameLookup(positionData.position_country)}</span>
                <span className="mx-2">•</span>
                <span>{positionData.position_work_mode}</span>
                <span className="mx-2">•</span>
                <span>{positionData.business_name}</span>
              </p>
            </div>

            <h1 className="mb-6 text-4xl font-bold capitalize md:text-5xl">
              {positionData.position_role}
            </h1>

            <p className="mb-6 text-xl">
              ¡{positionData.hiring_profile_name}, {i18n.joinOurTeam}!
            </p>

            <p className="mb-8 max-w-prose text-muted-foreground">
              {positionData.business_description}
            </p>

            <Button
              className="mb-4 w-full max-w-md bg-black text-white"
              size="lg"
            >
              <Link
                href={{
                  pathname: `${vacancy_name}/details`,
                  query: { token },
                }}
              >
                {i18n.applyLabel}
              </Link>
            </Button>

            <p className="text-sm text-muted-foreground">
              {i18n.responseTimeInfo}
            </p>
            <CancelApplicationDialog
              dictionary={dictionary}
              cardId={positionData.hiring_card_id}
            />
          </div>
        </div>
      </div>
    </>
  );
}
