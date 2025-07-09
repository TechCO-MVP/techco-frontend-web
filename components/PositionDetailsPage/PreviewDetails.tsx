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
    try {
      const lowRange = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.position_salary_range?.currency || "USD",
      }).format(Number(positionData.position_salary_range?.salary_range?.min));
      const highRange = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.position_salary_range?.currency || "USD",
      }).format(Number(positionData.position_salary_range?.salary_range?.max));
      return ` ${lowRange} - ${highRange} ${positionData.position_salary_range?.currency} `;
    } catch (error) {
      console.error("Error formatting salary range", error);
      return ` ${positionData.position_salary_range?.salary_range?.min} - ${positionData.position_salary_range?.salary_range?.max} ${positionData.position_salary_range?.currency} `;
    }
  };

  const formatFixedSalary = () => {
    try {
      const salary = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.position_salary_range?.currency || "USD",
      }).format(Number(positionData.position_salary_range?.salary));

      return `${salary}`;
    } catch (error) {
      console.error("Error formatting fixed salary", error);
      return ` ${positionData.position_salary_range?.salary} ${positionData.position_salary_range?.currency} `;
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <h1 className="text-4xl font-bold">{positionData.position_role} </h1>
      {/* #1 - Descripción de la empresa */}
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 🌍 Sobre nosotros</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.business_description}
        </p>
      </section>

      {/* #2 - Descripción del puesto */}
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Descripción del puesto </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.position_description}
        </p>
      </section>
      {/* #3 - Ubicación */}
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 📍 Ubicación </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.position_city} /{" "}
          {countryNameLookup(positionData.position_country || "CO")}
        </p>
      </section>
      {/* #4 - Modo de trabajo */}
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Modo de trabajo </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.position_work_mode}
        </p>
      </section>
      {/* #5 - Experiencia requerida */}
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2>🧑‍💻 Experiencia requerida </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.position_seniority}
        </p>
      </section>
      {/* #6 - Responsabilidades */}
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🚀 Responsabilidades</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.position_responsabilities?.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* #7 - Habilidades clave */}
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎯 Habilidades clave</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.position_skills?.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item.name}
            </li>
          ))}
        </ul>
      </div>
      {/* #8 - Educación */}
      {positionData.position_education &&
        positionData.position_education.length > 0 && (
          <div className="w-full space-y-3">
            <div className="flex flex-col gap-2 font-semibold">
              <h2> 🎓 Educación</h2>
            </div>
            <ul className="list-disc space-y-1 pl-6 text-gray-600">
              {positionData.position_education?.map((item, idx) => (
                <li key={idx} className="text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      {/* #9 - Idioma y Nivel */}
      {positionData.position_languages &&
        positionData.position_languages.length > 0 && (
          <div className="w-full space-y-3">
            <div className="flex flex-col gap-2 font-semibold">
              <h2> 🌐 Idioma requerido</h2>
            </div>
            <ul className="list-disc space-y-1 pl-6 text-gray-600">
              {positionData.position_languages?.map((lang, idx) => (
                <li key={idx} className="text-sm">
                  {lang.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      {/* #10 - Rango Salarial */}
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💰 Rango Salarial</h2>
        </div>

        {!positionData.position_salary_range && (
          <div className="space-y-4 text-gray-600">
            <p>📌 La compensación salarial se compartirá durante el proceso.</p>
          </div>
        )}
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
      {/* #11 - Lo que ofrecemos */}
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎁 Lo que ofrecemos</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6 text-gray-600">
          {positionData.position_benefits?.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
