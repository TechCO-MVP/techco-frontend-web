import { CancelApplicationDialog } from "@/components/CancelApplicationDialog/CancelApplicationDialog";
import { SendApplicationDialog } from "@/components/SendApplicationDialog/SendApplicationDialog";
import { apiEndpoints } from "@/lib/api-endpoints";
import { countryNameLookup } from "@/lib/utils";
import { PositionResponse } from "@/types";

export default async function Page({
  searchParams,
}: {
  params: Promise<{ company_name: string; vacancy_name: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
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
  console.log(positionData);

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
                📍 Ubicación: {positionData.position_city} /{" "}
                {countryNameLookup(positionData.position_country)}
              </span>
            </div>

            <section className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <h2> 🌍 Sobre nosotros</h2>
              </div>
              <p className="leading-relaxed text-gray-600">
                {positionData.business_description}
              </p>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <h2> 💻 Descripción del puesto</h2>
              </div>
              <div className="space-y-4 text-gray-600">
                <p>{positionData.position_description}</p>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-2 font-semibold">
                <h2>🚀 Responsabilidades</h2>
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
                <h2>🎯Requisitos clave</h2>
              </div>
              <ul className="space-y-2 text-gray-600">
                {positionData.position_skills.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>📌 {item.name}</span>
                  </li>
                ))}
              </ul>
            </section>

            {positionData.position_salary_range && (
              <section className="space-y-3">
                <div className="flex items-center gap-2 font-semibold">
                  <h2> 💰 Rango salarial</h2>
                </div>
                <div className="space-y-4 text-gray-600">
                  <p>
                    📌 La compensación para este rol está dentro del rango de{" "}
                    {formatSalaryRange()} anuales, según experiencia y
                    habilidades del candidato.
                  </p>
                </div>
              </section>
            )}
            <section className="space-y-3 pb-16">
              <div className="flex items-center gap-2 font-semibold">
                <h2> 🎁Lo que ofrecemos</h2>
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
              {/* <iframe
                className="mb-4 min-h-[400px] w-full"
                src="https://app.pipefy.com/public/phase_redirect/eff20bb5-38ea-4e36-8fe9-20707bd729e2?origin=share"
              ></iframe> */}
              <SendApplicationDialog cardId={positionData.hiring_card_id} />
              <CancelApplicationDialog cardId={positionData.hiring_card_id} />
              <p className="text-center text-sm text-muted-foreground">
                📌 Al enviar este formulario, aceptas nuestra política de
                privacidad y tratamiento de datos personales. Tus datos serán
                utilizados exclusivamente para fines de reclutamiento y no serán
                compartidos con terceros sin tu consentimiento.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
