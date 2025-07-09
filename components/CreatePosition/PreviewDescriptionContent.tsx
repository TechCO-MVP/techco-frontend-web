"use client";

import { FC, useEffect, useState } from "react";
import { Business, DraftPositionData, User } from "@/types";
import { countryNameLookup } from "@/lib/utils";
import { useUsers } from "@/hooks/use-users";
import { useCurrentUser } from "@/hooks/use-current-user";

type Props = {
  positionData: DraftPositionData | null;
  business?: Business;
};
export const PreviewDescriptionContent: FC<Props> = ({
  positionData,
  business,
}) => {
  const { currentUser } = useCurrentUser();
  const { users } = useUsers({
    businessId: business?._id,
    email: currentUser?.email,
  });
  const [recruiter, setRecruiter] = useState<User>();
  const [ownerPositionUser, setOwnerPositionUser] = useState<User>();
  useEffect(() => {
    if (recruiter) return;
    if (positionData?.recruiter_user_id) {
      setRecruiter(
        users.find((user) => user._id === positionData.recruiter_user_id),
      );
    }
  }, [positionData, recruiter, users]);

  useEffect(() => {
    if (ownerPositionUser) return;
    if (positionData?.owner_position_user_id) {
      setOwnerPositionUser(
        users.find((user) => user._id === positionData.owner_position_user_id),
      );
    }
  }, [positionData, ownerPositionUser, users]);

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
      return ` ${lowRange} - ${highRange} ${positionData.salary?.currency} `;
    } catch (error) {
      console.error("Error formatting salary range", error);
      return ` ${positionData.salary?.salary_range?.min} - ${positionData.salary?.salary_range?.max} ${positionData.salary?.currency} `;
    }
  };

  const formatFixedSalary = () => {
    try {
      const salary = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.salary?.currency || "USD",
      }).format(Number(positionData.salary?.salary ?? "0"));

      return ` ${salary} `;
    } catch (error) {
      console.error("Error formatting fixed salary", error);
      return ` ${positionData.salary?.salary} ${positionData.salary?.currency} `;
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <h1 className="text-4xl font-bold">{positionData.role} </h1>
      {/* #1 - Reclutador responsable */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 👩🏼‍💼 Reclutador responsable</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {recruiter?.full_name}
        </p>
      </div>
      {/* #2 - Solicitante de la vacante */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 👨🏻‍💼 Solicitante de la vacante</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {ownerPositionUser?.full_name}
        </p>
      </div>
      {/* #3 - Prioridad de contratación */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> ⚡️ Prioridad de contratación</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.hiring_priority}
        </p>
      </div>
      {/* #4 - Descripción de la empresa */}

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 🌍 Sobre nosotros</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {business?.description}
        </p>
      </section>
      {/* #5 - Descripción del puesto */}
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Descripción del puesto </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.description}
        </p>
      </section>
      {/* #6 - Ubicación */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 📍 Ubicación </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.city} /{" "}
          {countryNameLookup(positionData.country_code || "CO")}
        </p>
      </div>
      {/* #7 - Modo de trabajo */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Modo de trabajo</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.work_mode}
        </p>
      </div>

      {/* #8 - Experiencia requerida */}
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2>🧑‍💻 Experiencia requerida </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {positionData.seniority}
        </p>
      </section>
      {/* #9 - Responsabilidades */}
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

      {/* #10 - Habilidades */}
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
      {/* #11 - Educación */}
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
      {/* #12 - Idioma y Nivel */}
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2>🌐 Idioma requerido</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6">
          {positionData.languages.map((lang, idx) =>
            lang.name || lang.level ? (
              <li key={idx} className="text-gray-600">
                {lang.name && (
                  <span>
                    Idioma: <b>{lang.name}</b>
                  </span>
                )}
                {lang.level && (
                  <span>
                    {lang.name ? " | " : null}
                    Nivel: <b>{lang.level}</b>
                  </span>
                )}
              </li>
            ) : null,
          )}
        </ul>
      </div>

      {/* #13 - Salario */}
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

      {/* #14 - Beneficios */}
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
