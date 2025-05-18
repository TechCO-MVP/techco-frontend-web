"use client";

import { FC, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DraftPositionData } from "@/types";

type Props = {
  positionData: DraftPositionData;
};
export const PreviewPosition: FC<Props> = () => {
  const [items] = useState([
    {
      id: 1,
      text: "Diseñar e implementar arquitecturas escalables y eficientes",
    },
    {
      id: 2,
      text: "Liderar equipos de desarrollo en entornos ágiles (Scrum/Kanban)",
    },
    {
      id: 3,
      text: "Colaborar con stakeholders para definir requerimientos y mejoras técnicas",
    },
    {
      id: 4,
      text: "Implementar buenas prácticas de código y garantizar la calidad del software.",
    },
    {
      id: 5,
      text: "Optimizar el rendimiento y escalabilidad de las plataformas internas.",
    },
    {
      id: 6,
      text: "Investigar nuevas tecnologías y herramientas para mejorar los procesos",
    },
  ]);
  const [salaryOption, setSalaryOption] = useState<
    "fixed" | "range" | "not-specified"
  >("fixed");
  const [salaryRange] = useState({ min: 80000, max: 90000 });
  const [fixedSalary] = useState(75000);
  const [aboutText] = useState(
    "En High Scale Creative, desarrollamos soluciones tecnológicas innovadoras que impulsan la creatividad y la eficiencia operativa. Somos un equipo apasionado por la tecnología, el desarrollo ágil y la mejora continua.",
  );
  const [descriptionText] = useState(
    "Buscamos un Lead Developer con experiencia en arquitectura de software, liderazgo técnico y desarrollo ágil. Este rol es clave en el diseño y evolución de nuestras herramientas internas, optimizando procesos y garantizando la escalabilidad de nuestros sistemas.",
  );

  const formatSalaryRange = () => {
    const lowRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
    }).format(Number(salaryRange.min));
    const highRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
    }).format(Number(salaryRange.max));
    return `${lowRange} - ${highRange} USD`;
  };

  const formatFixedSalary = () => {
    const salary = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
    }).format(Number(fixedSalary));

    return `${salary} USD`;
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
      <h1 className="text-4xl font-bold">Lead Developer </h1>
      <div className="flex items-center gap-2 text-gray-600">
        <span>📍 Ubicación: Ciudad de Mexico / Mexico</span>
      </div>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 🌍 Sobre nosotros</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {aboutText ? aboutText : "Enter your information here"}
        </p>
      </section>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Descripción del puesto </h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {descriptionText ? descriptionText : "Enter your description here"}
        </p>
      </section>
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🚀 Responsabilidades</h2>
        </div>
        <ul className="list-disc space-y-1 pl-6">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm">
              {item.text}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💰 Rango Salarial</h2>
        </div>
        <RadioGroup
          onValueChange={(value: "fixed" | "range" | "not-specified") =>
            setSalaryOption(value)
          }
          defaultValue={salaryOption}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="range" id="range" />
            <Label htmlFor="range">Rango</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fixed" id="fixed" />
            <Label htmlFor="fixed">Salario fijo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="not-specified" id="not-specified" />
            <Label htmlFor="not-specified">Sin especificar</Label>
          </div>
        </RadioGroup>
        {salaryOption === "range" && (
          <div className="space-y-4 text-gray-600">
            <p>
              📌 La compensación para este rol está dentro del rango de{" "}
              {formatSalaryRange()} anuales, según experiencia y habilidades del
              candidato.
            </p>
          </div>
        )}

        {salaryOption === "fixed" && (
          <div className="space-y-4 text-gray-600">
            <p>
              📌 La compensación para este rol es de {formatFixedSalary()}{" "}
              anuales, según experiencia y habilidades del candidato.
            </p>
          </div>
        )}

        {salaryOption === "not-specified" && (
          <div className="space-y-4 text-gray-600">
            <p>📌 La compensación salarial se compartirá durante el proceso.</p>
          </div>
        )}
      </div>
    </div>
  );
};
