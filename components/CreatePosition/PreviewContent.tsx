"use client";

import { FC } from "react";
import { Business, DraftPositionData } from "@/types";
import { countryNameLookup } from "@/lib/utils";

type Props = {
  positionData: DraftPositionData | null;
  business?: Business;
};
export const PreviewContent: FC<Props> = ({ positionData, business }) => {
  if (!positionData) return null;

  const formatSalaryRange = () => {
    const lowRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary_range?.min));
    const highRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary_range?.max));
    return `${lowRange} - ${highRange} ${positionData.salary?.currency}`;
  };

  const formatFixedSalary = () => {
    const salary = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary));

    return `${salary}`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <h1 className="text-4xl font-bold">{positionData.role} </h1>
      <div className="flex items-center gap-2 text-gray-600">
        <span>
          📍 Ubicación: {positionData.city} /{" "}
          {countryNameLookup(positionData.country_code || "CO")}
        </span>
      </div>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 🌍 Sobre nosotros</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {business?.description}
        </p>
      </section>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Descripción del puesto </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.description}
        </p>
      </section>
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🚀 Responsabilidades</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6">
          {positionData.responsabilities?.map((item, idx) => (
            <li key={idx} className="text-sm capitalize">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💰 Rango Salarial</h2>
        </div>
        {positionData.salary?.salary_range && (
          <div className="space-y-4 text-gray-600">
            <p>
              📌 La compensación para este rol está dentro del rango de{" "}
              {formatSalaryRange()} anuales, según experiencia y habilidades del
              candidato.
            </p>
          </div>
        )}

        {positionData.salary?.salary && positionData.salary?.salary > 0 && (
          <div className="space-y-4 text-gray-600">
            <p>
              📌 La compensación para este rol es de {formatFixedSalary()}{" "}
              anuales, según experiencia y habilidades del candidato.
            </p>
          </div>
        )}
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎁 Lo que ofrecemos</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6">
          {positionData.benefits?.map((item, idx) => (
            <li key={idx} className="text-sm capitalize">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
