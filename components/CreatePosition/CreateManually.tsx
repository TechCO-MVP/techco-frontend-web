"use client";

import { FC, useState } from "react";
import { Textarea } from "../ui/textarea";
import { EditableList } from "./EditableList";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { LocationSelector } from "./LocationSelector";
import { Dictionary } from "@/types/i18n";
import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";

type CreateManuallyProps = {
  dictionary: Dictionary;
};
export const CreateManually: FC<Readonly<CreateManuallyProps>> = ({
  dictionary,
}) => {
  const params = useParams<{ lang: Locale }>();
  const { lang } = params;
  const { createPositionPage: i18n } = dictionary;
  const [salaryOption, setSalaryOption] = useState<
    "fixed" | "range" | "not-specified"
  >("fixed");
  const [salaryRange, setSalaryRange] = useState({ min: 0, max: 0 });
  const [fixedSalary, setFixedSalary] = useState(0);
  const [editAbout, setEditAbout] = useState(false);
  const [editDescription, setEditDescription] = useState(false);
  const [aboutText, setAboutText] = useState(
    "En High Scale Creative, desarrollamos soluciones tecnológicas innovadoras que impulsan la creatividad y la eficiencia operativa. Somos un equipo apasionado por la tecnología, el desarrollo ágil y la mejora continua.",
  );
  const [descriptionText, setDescriptionText] = useState(
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
    <div className="mx-auto flex h-[85vh] w-[85vw] flex-col justify-start overflow-y-auto overflow-x-hidden bg-white px-4 py-12">
      <div className="relative flex flex-col gap-2">
        <Link href={`/${lang}/dashboard/positions/create`} replace>
          <Button variant="ghost" className="-mx-8 text-sm">
            <ChevronLeft className="h-4 w-4" />
            {i18n.goBack}
          </Button>
        </Link>
        <Heading className="text-2xl" level={1}>
          Edicion de la vacante lead developer (000000)
        </Heading>
        <Text className="max-w-[1080px] text-sm text-muted-foreground" type="p">
          Realiza cambios en los detalles de la vacante. Puedes actualizar la
          información del cargo, los requisitos y la descripción de la
          publicación en cualquier momento. Recuerda guardar los cambios para
          que la información se actualice correctamente.
        </Text>
        <div className="mt-8 h-[1px] w-full bg-gray-200"></div>
      </div>
      <div className="mx-auto w-full max-w-3xl space-y-8 p-6">
        <h1 className="text-4xl font-bold">Lead Developer </h1>
        <div className="flex items-center gap-2 text-gray-600">
          <LocationSelector dictionary={dictionary} />
        </div>
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 🌍 Sobre nosotros</h2>
          </div>
          {editAbout ? (
            <Textarea
              onBlur={() => setEditAbout(false)}
              className="w-full"
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
            />
          ) : (
            <p
              onClick={() => setEditAbout(true)}
              className="cursor-text leading-relaxed text-gray-600"
            >
              {aboutText ? aboutText : "Enter your information here"}
            </p>
          )}
        </section>
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 💻 Descripción del puesto </h2>
          </div>
          {editDescription ? (
            <Textarea
              placeholder="Enter your description here"
              onBlur={() => setEditDescription(false)}
              className="w-full"
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
            />
          ) : (
            <p
              onClick={() => setEditDescription(true)}
              className="cursor-text leading-relaxed text-gray-600"
            >
              {descriptionText
                ? descriptionText
                : "Enter your description here"}
            </p>
          )}
        </section>
        <div className="w-full space-y-3">
          <div className="flex flex-col gap-2 font-semibold">
            <h2>🚀 Responsabilidades</h2>
          </div>
          <EditableList items={[]} onItemsChange={() => {}} />
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
              <div className="flex gap-2">
                <Input
                  placeholder="Mínimo"
                  type="number"
                  onChange={(e) =>
                    setSalaryRange({
                      ...salaryRange,
                      min: parseInt(e.target.value),
                    })
                  }
                />
                <Input
                  placeholder="Máximo"
                  type="number"
                  onChange={(e) =>
                    setSalaryRange({
                      ...salaryRange,
                      max: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <p>
                📌 La compensación para este rol está dentro del rango de{" "}
                {formatSalaryRange()} mensuales, según experiencia y habilidades
                del candidato.
              </p>
            </div>
          )}

          {salaryOption === "fixed" && (
            <div className="space-y-4 text-gray-600">
              <div className="flex gap-2">
                <Input
                  placeholder="Salario"
                  type="number"
                  onChange={(e) => setFixedSalary(parseInt(e.target.value))}
                />
              </div>
              <p>
                📌 La compensación para este rol es de {formatFixedSalary()}{" "}
                mensuales, según experiencia y habilidades del candidato.
              </p>
            </div>
          )}

          {salaryOption === "not-specified" && (
            <div className="space-y-4 text-gray-600">
              <p>
                📌 La compensación salarial se compartirá durante el proceso.
              </p>
            </div>
          )}
        </div>
      </div>
      {/* <StickyFooter isSaving={false} onCancel={() => {}} onSave={() => {}} />  */}
    </div>
  );
};
