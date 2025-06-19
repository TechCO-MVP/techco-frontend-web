import { ApplicationForm } from "@/components/ApplicationForm/ApplicationForm";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { apiEndpoints } from "@/lib/api-endpoints";
import { PositionResponse } from "@/types";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale; company_name: string; vacancy_name: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { lang, company_name, vacancy_name } = await params;
  const dictionary = await getDictionary(lang);
  const { token } = await searchParams;
  if (!token) return <p>Missing token</p>;
  const response = await fetch(apiEndpoints.positionDetails({ token }), {
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
    <ApplicationForm
      lang={lang}
      token={token}
      companyName={company_name}
      vacancyName={vacancy_name}
      positionData={positionData}
      dictionary={dictionary}
    />
  );
}
