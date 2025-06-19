import { CancelApplicationDialog } from "@/components/CancelApplicationDialog/CancelApplicationDialog";
import { SendPublicApplicationDialog } from "@/components/SendPublicApplicationDialog/SendPublicApplicationDialog";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import { apiEndpoints } from "@/lib/api-endpoints";
import { countryNameLookup } from "@/lib/utils";
import { PositionResponse } from "@/types";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale; company_name: string; vacancy_name: string }>;
  searchParams: Promise<{ token?: string; positionId?: string }>;
}) {
  const { lang } = await params;
  const { token, positionId } = await searchParams;
  const dictionary = await getDictionary(lang);
  const { positionOfferPage: i18n } = dictionary;
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
    "%c[Debug] position",
    "background-color: teal; font-size: 20px; color: white",
    position,
  );
  const formatSalaryRange = () => {
    if (!positionData.position_salary_range) return "";
    const range = positionData.position_salary_range.salary_range;
    const currency = positionData.position_salary_range.currency;
    const lowRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(range.min));
    const highRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(range.max));
    return `${lowRange} - ${highRange} ${currency}`;
  };

  const formatFixedSalary = () => {
    const salary = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.position_salary_range?.currency || "USD",
    }).format(Number(positionData.position_salary_range?.salary));

    return `${salary} `;
  };
  return (
    <div className="relative flex h-full min-h-screen items-center justify-center bg-gray-50">
      <div
        className="min-h-100vh flex h-full min-h-screen w-full flex-col justify-center bg-gray-50"
        style={{
          backgroundImage: "url('/assets/background.jpeg')",
          backgroundBlendMode: "lighten",
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      >
        <div className="mx-auto flex h-[85vh] w-[85vw] flex-col items-center justify-start overflow-y-auto overflow-x-hidden bg-white px-4 py-12">
          <div className="mx-auto max-w-3xl space-y-8 p-6">
            <h1 className="text-4xl font-bold">{positionData.position_role}</h1>

            <div className="flex items-center gap-2 text-gray-600">
              <span>
                📍 {i18n.locationLabel}: {positionData.position_city} /{" "}
                {countryNameLookup(positionData.position_country)}
              </span>
            </div>

            <section className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <h2> 🌍 {i18n.aboutUsLabel}</h2>
              </div>
              <p className="leading-relaxed text-gray-600">
                {positionData.business_description}
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <h2> 💻 {i18n.jobDescriptionLabel}</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>{positionData.position_description}</p>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <h2>🚀 {i18n.responsabilitiesLabel}</h2>
              </div>
              <ul className="space-y-2">
                {positionData.position_responsabilities.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600"
                  >
                    <span>✅ {item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <h2>🎯{i18n.requirementsLabel}</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                {positionData.position_skills.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>📌 {item.name}</span>
                  </li>
                ))}
              </ul>
            </section>

            {positionData.position_salary_range?.salary_range && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <h2> 💰 {i18n.salaryRangeLabel}</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>
                    📌 {i18n.salaryDescriptionStart} {formatSalaryRange()}{" "}
                    {i18n.salaryDescriptionEnd}
                  </p>
                </div>
              </section>
            )}

            {positionData.position_salary_range?.salary && (
              <div className="space-y-4 text-gray-600">
                <p>
                  📌 {i18n.fixedsalaryDescriptionStart} {formatFixedSalary()}
                  {i18n.salaryDescriptionEnd}.
                </p>
              </div>
            )}
            <section className="space-y-3 pb-16">
              <div className="flex items-center gap-2 font-semibold">
                <h2> 🎁 {i18n.whatWeOfferLabel}</h2>
              </div>
              {positionData.position_benefits && (
                <ul className="space-y-2">
                  {positionData.position_benefits.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-600"
                    >
                      ✨<span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <div className="relative">
              <div className="absolute -left-[35vw] top-0 h-[1px] w-[100vw] bg-gray-200"></div>
            </div>
            <div className="flex flex-col items-center pt-16">
              <SendPublicApplicationDialog
                dictionary={dictionary}
                positionData={positionData}
              />
              <CancelApplicationDialog
                dictionary={dictionary}
                cardId={positionData.hiring_card_id}
              />
              <p className="text-center text-sm text-muted-foreground">
                📌 {i18n.disclaimerText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
