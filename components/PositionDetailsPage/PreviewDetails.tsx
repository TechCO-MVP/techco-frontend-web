"use client";

import { FC } from "react";
import { PositionData } from "@/types";
import { countryNameLookup } from "@/lib/utils";

type Props = {
  positionData: PositionData;
};
export const PreviewDetails: FC<Props> = ({ positionData }) => {
  if (!positionData) return null;

  const formatSalaryRange = () => {
    const lowRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.position_salary_range?.currency || "USD",
    }).format(Number(positionData.position_salary_range?.salary_range?.min));
    const highRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.position_salary_range?.currency || "USD",
    }).format(Number(positionData.position_salary_range?.salary_range?.max));
    return `${lowRange} - ${highRange} ${positionData.position_salary_range?.currency}`;
  };

  const formatFixedSalary = () => {
    const salary = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.position_salary_range?.currency || "USD",
    }).format(Number(positionData.position_salary_range?.salary));

    return `${salary}`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <h1 className="text-4xl font-bold">{positionData.position_role} </h1>
      <div className="flex items-center gap-2 text-gray-600">
        <span>
          📍 Ubicación: {positionData.position_city} /{" "}
          {countryNameLookup(positionData.position_country || "CO")}
        </span>
      </div>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 🌍 Sobre nosotros</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.business_description}
        </p>
      </section>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Descripción del puesto </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.position_description}
        </p>
      </section>
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🚀 Responsabilidades</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.position_responsabilities?.map((item, idx) => (
            <li key={idx} className="text-sm capitalize">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎯 Habilidades clave</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.position_skills?.map((item, idx) => (
            <li key={idx} className="text-sm capitalize">
              {item.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💰 Rango Salarial</h2>
        </div>
        {positionData.position_salary_range?.salary_range && (
          <div className="space-y-4 text-gray-600">
            <p>
              📌 La compensación para este rol está dentro del rango de{" "}
              {formatSalaryRange()} mensuales, según experiencia y habilidades
              del candidato.
            </p>
          </div>
        )}

        {positionData.position_salary_range?.salary &&
          Number(positionData.position_salary_range?.salary) > 0 && (
            <div className="space-y-4 text-gray-600">
              <p>
                📌 La compensación para este rol es de {formatFixedSalary()}{" "}
                mensuales, según experiencia y habilidades del candidato.
              </p>
            </div>
          )}
      </div>

      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎁 Lo que ofrecemos</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.position_benefits?.map((item, idx) => (
            <li key={idx} className="text-sm capitalize">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
