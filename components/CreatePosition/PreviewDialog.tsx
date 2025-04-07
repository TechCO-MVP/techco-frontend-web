"use client";

import { Dispatch, type FC, SetStateAction, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Dictionary } from "@/types/i18n";
import { countryNameLookup } from "@/lib/utils";
import { Textarea } from "../ui/textarea";
import { EditableList } from "./EditableList";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
type Props = {
  dictionary: Dictionary;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const PreviewDialog: FC<Readonly<Props>> = ({
  dictionary,
  open,
  setOpen,
}) => {
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
  console.log("dictionary", dictionary);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTitle className="hidden">x</DialogTitle>

      <DialogContent className="h-screen w-screen max-w-[90vw] p-0">
        <div className="flex w-full flex-col items-center justify-center overflow-auto rounded-md bg-white">
          <div className="mx-auto flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden bg-white px-4 py-12">
            <div className="mx-auto w-[80%] space-y-8 p-6">
              <h1 className="text-4xl font-bold">Lead Developer </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <span>📍 Ubicación: Bogotá /{countryNameLookup("CO")}</span>
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
                <EditableList />
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
                      {formatSalaryRange()} anuales, según experiencia y
                      habilidades del candidato.
                    </p>
                  </div>
                )}

                {salaryOption === "fixed" && (
                  <div className="space-y-4 text-gray-600">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Salario"
                        type="number"
                        onChange={(e) =>
                          setFixedSalary(parseInt(e.target.value))
                        }
                      />
                    </div>
                    <p>
                      📌 La compensación para este rol es de{" "}
                      {formatFixedSalary()} anuales, según experiencia y
                      habilidades del candidato.
                    </p>
                  </div>
                )}

                {salaryOption === "not-specified" && (
                  <div className="space-y-4 text-gray-600">
                    <p>
                      📌 La compensación salarial se compartirá durante el
                      proceso.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
