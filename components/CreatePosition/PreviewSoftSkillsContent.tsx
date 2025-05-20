"use client";

import { FC } from "react";
import { Assessment } from "@/types";

type Props = {
  assessment: Assessment | null;
};
export const PreviewSoftSkillsContent: FC<Props> = ({ assessment }) => {
  if (!assessment) return null;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col p-6 pb-16">
      {assessment.soft_skills.map((skill, index) => (
        <div key={index}>
          <h3 className="mb-4 text-xl font-bold">Competencia:{skill.name}</h3>
          {skill.dimensions.map((dimension, index) => (
            <div key={index} className="flex flex-col gap-2">
              <h4 className="mb-4 text-lg font-bold">
                Dimensión: {dimension.name}
              </h4>
              <p className="text-gray-600">
                <b className="text-black">Pregunta</b>: {dimension.question}
              </p>
              <p className="mb-4 text-gray-600">
                <b className="text-black">Justificación</b>:
                {dimension.explanation}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
