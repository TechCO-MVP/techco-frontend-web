"use client";

import { FC } from "react";
import { TechnicalAssessment } from "@/types";

type Props = {
  assessment: TechnicalAssessment | null;
};
export const PreviewTechnicalSkillsContent: FC<Props> = ({ assessment }) => {
  if (!assessment) return null;
  const missionItems = assessment?.your_mission
    ?.split(/\d+\.\s/)
    .filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col p-6 pb-16">
      <div className="mb-4 flex items-center gap-2 text-gray-600">
        Este es el assessment que verán tus candidatos. Está diseñado con base
        en el rol y los retos reales del área, para ayudarte a identificar quién
        tiene las habilidades necesarias para enfrentarlos desde el día uno.
      </div>
      <section className="mb-4 w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Objetivo del assessment</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {assessment?.assesment_goal}
        </p>
      </section>
      <section className="mb-4 w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Contexto de tu caso de negocio</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {assessment?.challenge}
        </p>
      </section>

      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> Tu Misión</h2>
        </div>
        <ol className="list-decimal space-y-2 pl-6 text-gray-600">
          {missionItems?.map((item, idx) => <li key={idx}>{item.trim()}</li>)}
        </ol>
      </section>
    </div>
  );
};
