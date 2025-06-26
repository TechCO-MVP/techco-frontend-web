"use client";

import { FC } from "react";
import { Business, DraftPositionData } from "@/types";
import { countryNameLookup } from "@/lib/utils";

type Props = {
  positionData: DraftPositionData | null;
  business?: Business;
};
export const PreviewDescriptionContent: FC<Props> = ({
  positionData,
  business,
}) => {
  if (!positionData) return null;

  const formatSalaryRange = () => {
    try {
      const lowRange = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.salary?.currency || "USD",
      }).format(Number(positionData.salary?.salary_range?.min ?? "0"));
      const highRange = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.salary?.currency || "USD",
      }).format(Number(positionData.salary?.salary_range?.max ?? "0"));
      return ` ${lowRange} - ${highRange} ${positionData.salary?.currency}`;
    } catch (error) {
      console.error("Error formatting salary range", error);
      return ` ${positionData.salary?.salary_range?.min} - ${positionData.salary?.salary_range?.max} ${positionData.salary?.currency}`;
    }
  };

  const formatFixedSalary = () => {
    try {
      const salary = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.salary?.currency || "USD",
      }).format(Number(positionData.salary?.salary ?? "0"));

      return `${salary} `;
    } catch (error) {
      console.error("Error formatting fixed salary", error);
      return ` ${positionData.salary?.salary} ${positionData.salary?.currency}`;
    }
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

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2>🧑‍💻 Experiencia requerida </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.seniority}
        </p>
      </section>
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🚀 Responsabilidades</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.responsabilities?.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {positionData.education && positionData.education.length > 0 && (
        <div className="w-full space-y-3">
          <div className="flex flex-col gap-2 font-semibold">
            <h2> 🎓 Educación</h2>
          </div>
          <ul className="list-disc space-y-1 pl-6 text-gray-600">
            {positionData.education?.map((item, idx) => (
              <li key={idx} className="text-sm">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎯 Habilidades clave</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.skills?.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item.name}
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
              {formatSalaryRange()} mensuales, según experiencia y habilidades
              del candidato.
            </p>
          </div>
        )}

        {positionData.salary?.salary &&
          Number(positionData.salary?.salary) > 0 && (
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
          {positionData.benefits?.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
