"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { countryNameLookup } from "@/lib/utils";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";
import { useBusinesses } from "@/hooks/use-businesses";
import { Step, Stepper } from "./Stepper";
import { Dictionary } from "@/types/i18n";

type Props = {
  dictionary: Dictionary;
};
export const PreviewPosition: FC<Props> = ({ dictionary }) => {
  const [steps, setSteps] = useState<Step[]>([]);
  const { createPositionPage: i18n } = dictionary;

  const params = useParams<{
    lang: Locale;
    id: string;
    position_id: string;
  }>();
  const { position_id, id } = params;
  const { businesses } = useBusinesses();
  const business = useMemo(() => {
    return businesses.find((b) => b._id === id);
  }, [id, businesses]);
  const { data: positionConfiguration } = usePositionConfigurations({
    id: position_id,
    businessId: id,
  });
  const positionData = positionConfiguration?.body.data?.[0]?.phases?.[0]?.data;

  useEffect(() => {
    const currentPosition = positionConfiguration?.body.data?.[0];
    if (currentPosition) {
      setSteps(
        currentPosition.phases.map((phase) => ({
          title: phase.name,
          status: phase.status,
        })),
      );
    }
  }, [positionConfiguration]);

  if (!positionData) return null;

  const formatSalaryRange = () => {
    const lowRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary_range.min));
    const highRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary_range.max));
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
    <div className="mx-auto w-full max-w-[60rem] space-y-8 p-6">
      <div className="mx-auto flex w-fit min-w-[60rem] flex-col gap-7 rounded-md px-10 py-2 shadow-md">
        <Stepper steps={steps} setSteps={setSteps} i18n={i18n} />
      </div>

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
