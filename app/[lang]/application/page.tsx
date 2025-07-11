import { Button } from "@/components/ui/button";
import Image from "next/image";
import { apiEndpoints } from "@/lib/api-endpoints";
import { countryNameLookup } from "@/lib/utils";
import Link from "next/link";
import { PositionResponse } from "@/types";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { CancelApplicationDialog } from "@/components/CancelApplicationDialog/CancelApplicationDialog";
import { Text } from "@/components/Typography/Text";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale; company_name: string; vacancy_name: string }>;
  searchParams: Promise<{ token?: string; positionId?: string }>;
}) {
  const { lang } = await params;

  const dictionary = await getDictionary(lang);
  const { positionOfferPage: i18n } = dictionary;
  const { token, positionId } = await searchParams;
  if (!token && !positionId) return <p>Missing token or positionId</p>;
  const response = await fetch(
    apiEndpoints.positionDetails({ token, positionId }),
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.API_KEY ?? "",
      },
    },
  );
  if (!response.ok) {
    return <p>Failed to fetch position details</p>;
  }

  const position: PositionResponse = await response.json();
  const {
    body: { data: positionData },
  } = position;
  console.log(
    "%c[Debug] positionData",
    "background-color: teal; font-size: 20px; color: white",
    positionData,
  );
  return (
    <>
      <div className="relative flex h-full min-h-screen flex-col items-center justify-center bg-gray-50">
        <nav className="relative flex h-20 w-full items-center justify-between px-28">
          <Image
            priority
            width={152}
            height={36}
            src="/assets/talent_connect.svg"
            alt="TechCo"
          />
        </nav>
        <div
          className="min-h-100vh flex h-full min-h-screen w-full flex-col bg-gray-50"
          style={{
            backgroundImage: "url('/assets/background.jpeg')",
            backgroundBlendMode: "lighten",
            backgroundColor: "rgba(255,255,255,0.8)",
          }}
        >
          <div className="mx-auto mb-8 flex h-full w-[85vw] max-w-[1000px] flex-col items-center justify-center border-b-[5px] border-b-talent-orange-500 bg-white px-4 py-12 text-center shadow-talent-green md:h-[85vh]">
            <div className="mb-8">
              <Image
                src="/assets/talent_connect.svg"
                alt={positionData.business_name}
                width={64}
                height={64}
                className="mx-auto"
              />
            </div>

            <div className="mb-6 space-y-1 text-sm text-muted-foreground">
              <p className="flex flex-wrap items-center justify-center uppercase tracking-wide">
                <span>{positionData.position_entity.city}</span>
                <span className="mx-2">•</span>
                <span>
                  {countryNameLookup(positionData.position_entity.country_code)}
                </span>
                <span className="mx-2">•</span>
                <span>{positionData.position_entity.work_mode}</span>
                <span className="mx-2">•</span>
                <span>{positionData.business_name}</span>
              </p>
            </div>

            <h1 className="mb-6 text-4xl font-bold capitalize text-talent-green-500 md:text-5xl">
              {positionData.position_entity.role}
            </h1>

            <p className="mb-6 text-xl">¡{i18n.joinOurTeam}!</p>

            <p className="mb-8 max-w-prose text-muted-foreground">
              {positionData.position_entity.description}
            </p>
            <Button
              className="mb-4 w-full max-w-md"
              variant="talentGreen"
              size="lg"
            >
              <Link
                className="flex h-10 items-center justify-center"
                href={{
                  pathname: `application/details`,
                  query: { positionId },
                }}
              >
                {i18n.applyLabel}
              </Link>
            </Button>

            <CancelApplicationDialog
              dictionary={dictionary}
              cardId={positionData.hiring_card_id}
            />
          </div>
        </div>
        <footer className="flex h-[60px] w-full items-center justify-center bg-talent-footer">
          <Text size="small" type="p" className="text-white">
            Todos los derechos reservados - nombre de la empresa 2025
          </Text>
        </footer>
      </div>
    </>
  );
}
