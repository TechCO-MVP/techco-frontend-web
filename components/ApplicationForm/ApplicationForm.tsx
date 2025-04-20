"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";
import { Dictionary } from "@/types/i18n";
import { FC, useState } from "react";
import { Step, Stepper } from "../CreatePosition/Stepper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIAL_CODES } from "@/lib/data/countries";

type ApplicationFormProps = {
  dictionary: Dictionary;
};
export const ApplicationForm: FC<Readonly<ApplicationFormProps>> = ({
  dictionary,
}) => {
  const { createPositionPage: i18n } = dictionary;
  const [selectedDialCode, setSelectedDialCode] = useState("+51");

  const [steps, setSteps] = useState<Step[]>([
    {
      title: i18n.descriptionStep,
      status: "complete",
    },
    {
      title: i18n.initialTestStep,
      status: "pending",
    },
    {
      title: i18n.softSkillsStep,
      status: "pending",
    },
    {
      title: i18n.technicalSkillsStep,
      status: "skipped",
    },
    {
      title: i18n.publishedStep,
      status: "pending",
    },
  ]);
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Progress Tracker */}
      <div className="mx-auto mb-12 flex max-w-3xl flex-col gap-7 overflow-hidden px-10 py-8 shadow-md">
        <Stepper steps={steps} setSteps={setSteps} i18n={i18n} />
      </div>
      <div className="mb-12 h-[1px] w-full bg-gray-200"></div>

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">¡Bienvenido, Carlos!</h1>
        <p className="mb-2 text-lg">¡Estamos listos para conocerte mejor!</p>
        <p className="mb-4 text-sm text-gray-600">
          Queremos asegurarnos de tener toda la información importante para
          continuar con tu proceso de selección. Tómate unos minutos para
          completar estos datos.
        </p>
      </div>

      {/* Contact Information */}
      <div className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Contacto</h2>
        <p className="mb-2 text-sm">Correo electrónico.</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input placeholder="Correo@prueba.com" />
          <div className="flex">
            <Select
              defaultValue="+51"
              onValueChange={(value) => setSelectedDialCode(value)}
            >
              <SelectTrigger className="focus:ring-none w-[140px] rounded-r-none border-r-0 focus:ring-0">
                <SelectValue placeholder="Código" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {DIAL_CODES.map((code) => (
                  <SelectItem key={code.label} value={code.value}>
                    {code.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="300 123 456"
              className="flex-1 rounded-l-none"
            />
          </div>
        </div>
      </div>

      {/* Skills Section */}
      <div className="mb-8">
        <h3 className="mb-2 text-sm">
          ¿Con cuáles de estas habilidades cuentas? (Selecciona una opción para
          cada habilidad)
        </h3>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm">Escucha activa</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="escucha-si" />
                  <label htmlFor="escucha-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="escucha-no" />
                  <label htmlFor="escucha-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Resolución de conflictos</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="resolucion-si" />
                  <label htmlFor="resolucion-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="resolucion-no" />
                  <label htmlFor="resolucion-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Compromiso con la calidad</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="compromiso-si" />
                  <label htmlFor="compromiso-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="compromiso-no" />
                  <label htmlFor="compromiso-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Flexibilidad ante el cambio</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="flexibilidad-si" />
                  <label htmlFor="flexibilidad-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="flexibilidad-no" />
                  <label htmlFor="flexibilidad-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Manejo del estrés</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="estres-si" />
                  <label htmlFor="estres-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="estres-no" />
                  <label htmlFor="estres-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm">Redacción profesional</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="redaccion-si" />
                  <label htmlFor="redaccion-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="redaccion-no" />
                  <label htmlFor="redaccion-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Pensamiento analítico</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="pensamiento-si" />
                  <label htmlFor="pensamiento-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="pensamiento-no" />
                  <label htmlFor="pensamiento-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Colaboración</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="colaboracion-si" />
                  <label htmlFor="colaboracion-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="colaboracion-no" />
                  <label htmlFor="colaboracion-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Actitud proactiva</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="actitud-si" />
                  <label htmlFor="actitud-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="actitud-no" />
                  <label htmlFor="actitud-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Comunicación efectiva</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="comunicacion-si" />
                  <label htmlFor="comunicacion-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="comunicacion-no" />
                  <label htmlFor="comunicacion-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Previous Responsibilities */}
      <div className="mb-8 border-t pt-6">
        <h2 className="mb-2 text-lg font-medium">
          Responsabilidades anteriores
        </h2>
        <h3 className="mb-2 text-sm">
          ¿Has tenido estas responsabilidades? (Selecciona una opción para cada
          habilidad)
        </h3>

        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm">Liderar equipos de trabajo</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="liderar-si" />
                  <label htmlFor="liderar-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="liderar-no" />
                  <label htmlFor="liderar-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Optimizar procesos internos</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="optimizar-si" />
                  <label htmlFor="optimizar-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="optimizar-no" />
                  <label htmlFor="optimizar-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Cumplimiento de políticas internas</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="politicas-si" />
                  <label htmlFor="politicas-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="politicas-no" />
                  <label htmlFor="politicas-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">
                Colaboración con equipos interdisciplinarios
              </p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="equipos-si" />
                  <label htmlFor="equipos-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="equipos-no" />
                  <label htmlFor="equipos-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <p className="mb-1 text-sm">Presentar reportes a dirección</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="reportes-si" />
                  <label htmlFor="reportes-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="reportes-no" />
                  <label htmlFor="reportes-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">
                Cumplimiento de objetivos y metas asignadas
              </p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="objetivos-si" />
                  <label htmlFor="objetivos-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="objetivos-no" />
                  <label htmlFor="objetivos-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">Apoyo a otros miembros del equipo</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="apoyo-si" />
                  <label htmlFor="apoyo-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="apoyo-no" />
                  <label htmlFor="apoyo-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-1 text-sm">
                Atención y resolución de incidencias
              </p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="incidencias-si" />
                  <label htmlFor="incidencias-si" className="text-sm">
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="incidencias-no" />
                  <label htmlFor="incidencias-no" className="text-sm">
                    No
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Salary Expectation */}
      <div className="mb-8 border-t pt-6">
        <h2 className="mb-2 text-lg font-medium">Aspiración salarial</h2>
        <p className="mb-2 text-sm">
          ¿Cuál es tu aspiración salarial para este cargo?
        </p>
        <Input
          placeholder="Escribe aquí tu expectativa salarial"
          className="max-w-md"
        />
      </div>

      {/* Availability */}
      <div className="mb-8 border-t pt-6">
        <h2 className="mb-2 text-lg font-medium">Disponibilidad de inicio</h2>
        <p className="mb-2 text-sm">
          ¿Cuál es tu aspiración salarial para este cargo?
        </p>
        <div className="relative max-w-md">
          <Input placeholder="Selecciona una fecha" className="pl-10" />
          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Work Modality */}
      <div className="mb-8 border-t pt-6">
        <h2 className="mb-2 text-lg font-medium">Modalidad de trabajo</h2>
        <p className="mb-2 text-sm">
          ¿Estás de acuerdo con que el trabajo sea remoto?
        </p>
        <div className="flex gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="remoto-si" />
            <label htmlFor="remoto-si" className="text-sm">
              Sí
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="remoto-no" />
            <label htmlFor="remoto-no" className="text-sm">
              No
            </label>
          </div>
        </div>
      </div>

      {/* Form Buttons */}
      <div className="flex justify-end gap-4 border-t pt-6">
        <Button variant="outline" className="px-8">
          Cancelar
        </Button>
        <Button className="bg-gray-800 px-8 hover:bg-gray-700">
          Enviar formulario
        </Button>
      </div>
    </div>
  );
};
