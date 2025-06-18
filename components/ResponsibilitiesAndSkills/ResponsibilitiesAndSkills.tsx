"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DraftPositionData } from "@/types";
import React, { useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mocked DraftPositionData object
const mockDraftPositionData: DraftPositionData = {
  business_id: "biz-123",
  recruiter_user_id: "user-456",
  responsible_users: ["user-789"],
  role: "Desarrollador Frontend",
  seniority: "Semi Senior",
  country_code: "PE",
  city: "Lima",
  description: "Responsable de desarrollar interfaces de usuario.",
  responsabilities: [
    "Liderar equipos de trabajo",
    "Presentar reportes a dirección",
    "Cumplimiento de objetivos y metas asignadas",
    "Apoyo a otros miembros del equipo",
    "Atención y resolución de incidencias",
    "Optimizar procesos internos",
    "Cumplimiento de políticas internas",
    "Colaboración con equipos interdisciplinarios",
  ],
  skills: [
    { name: "Escucha activa", required: true },
    { name: "Resolución de conflictos", required: false },
    { name: "Compromiso con la calidad", required: true },
    { name: "Flexibilidad ante el cambio", required: false },
    { name: "Manejo del estrés", required: false },
    { name: "Redacción profesional", required: false },
    { name: "Pensamiento analítico", required: true },
    { name: "Colaboración", required: true },
    { name: "Actitud proactiva", required: false },
    { name: "Comunicación efectiva", required: true },
  ],
  languages: [
    { name: "Español", level: "Nativo" },
    { name: "Inglés", level: "Intermedio" },
  ],
  hiring_priority: "Alta",
  work_mode: "REMOTE",
  status: "DRAFT",
  benefits: ["Seguro de salud", "Horario flexible"],
  salary: {
    currency: "PEN",
    salary: null,
    salary_range: { min: "4000", max: "6000" },
  },
};

// Mocked dial codes for select
const DIAL_CODES = [
  { label: "+51 (Perú)", value: "+51" },
  { label: "+52 (México)", value: "+52" },
  { label: "+54 (Argentina)", value: "+54" },
  { label: "+57 (Colombia)", value: "+57" },
];

export const ResponsibilitiesAndSkills: React.FC = () => {
  const [selectedDialCode, setSelectedDialCode] = useState(DIAL_CODES[0].value);
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <form className="mx-auto max-w-3xl px-4 py-8">
      {/* Title and Welcome Section */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">¡Bienvenido, Carlos!</h1>
        <p className="mb-2 text-lg font-semibold">
          ¡Estamos listos para conocerte mejor!
        </p>
        <p className="mb-4 text-sm text-gray-600">
          Queremos asegurarnos de tener toda la información importante para
          continuar con tu proceso de selección. Tómate unos minutos para
          completar estos datos.
        </p>
      </div>

      {/* Contact Information */}
      <div className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Contacto</h2>
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
          <div className="flex h-full flex-col justify-end">
            <Label htmlFor="email" className="mb-1 block text-sm">
              Correo electrónico
            </Label>
            <Input
              id="email"
              name="email"
              placeholder="correo@prueba.com"
              type="email"
              autoComplete="email"
            />
          </div>
          <div className="flex h-full flex-col justify-end">
            <Label htmlFor="phone" className="mb-1 block text-sm">
              Teléfono
            </Label>
            <div className="flex w-full">
              <Select
                defaultValue={selectedDialCode}
                onValueChange={setSelectedDialCode}
              >
                <SelectTrigger className="w-[140px] rounded-r-none border-r-0">
                  <SelectValue placeholder="Código" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {DIAL_CODES.map((code) => (
                    <SelectItem key={code.value} value={code.value}>
                      {code.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                id="phone"
                name="phone"
                placeholder="300 123 456"
                className="flex-1 rounded-l-none"
                type="tel"
                autoComplete="tel"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Responsabilidades anteriores */}
      <section className="mb-8 border-t pt-6">
        <h2 className="mb-2 text-lg font-medium">
          Responsabilidades anteriores
        </h2>
        <h3 className="mb-2 text-sm">
          ¿Has tenido estas responsabilidades? (Selecciona una opción para cada
          habilidad)
        </h3>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          {mockDraftPositionData.responsabilities.map((resp, idx) => (
            <div key={resp} className="space-y-1">
              <p className="mb-1 text-sm">{resp}</p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id={`resp-${idx}-yes`} name={`resp-${idx}`} />
                  <Label htmlFor={`resp-${idx}-yes`} className="text-sm">
                    Sí
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id={`resp-${idx}-no`} name={`resp-${idx}`} />
                  <Label htmlFor={`resp-${idx}-no`} className="text-sm">
                    No
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Habilidades */}
      <section className="mb-8 border-t pt-6">
        <h2 className="mb-2 text-lg font-medium">
          ¿Con cuáles de estas habilidades cuentas? (Selecciona una opción para
          cada habilidad)
        </h2>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          {mockDraftPositionData.skills.map((skill, idx) => (
            <div key={skill.name} className="space-y-1">
              <p className="mb-1 text-sm">
                {skill.name}
                {skill.required && (
                  <span className="ml-2 text-xs text-red-500">
                    (Obligatoria)
                  </span>
                )}
              </p>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id={`skill-${idx}-yes`} name={`skill-${idx}`} />
                  <Label htmlFor={`skill-${idx}-yes`} className="text-sm">
                    Sí
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id={`skill-${idx}-no`} name={`skill-${idx}`} />
                  <Label htmlFor={`skill-${idx}-no`} className="text-sm">
                    No
                  </Label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Salary Expectation */}
      <div className="mb-8 border-t pt-6">
        <h2 className="mb-2 text-lg font-medium">Aspiración salarial</h2>
        <p className="mb-2 text-sm">
          ¿Cuál es tu aspiración salarial para este cargo?
        </p>
        <Input
          id="salary-expectation"
          name="salary-expectation"
          placeholder="Escribe aquí tu expectativa salarial"
          className="max-w-md"
          type="number"
          min="0"
        />
      </div>

      {/* Disponibilidad de inicio */}
      <div className="mb-8">
        <h2 className="mb-2 text-lg font-medium">Disponibilidad de inicio</h2>
        <p className="mb-2 text-sm">
          ¿Cuál es tu disponibilidad de inicio para este cargo?
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={
                "relative w-full max-w-md justify-start pl-10 text-left font-normal" +
                (!date ? " text-muted-foreground" : "")
              }
              type="button"
            >
              <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              {date
                ? format(date, "PPP", { locale: es })
                : "Selecciona una fecha"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
              locale={es}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancelar
        </Button>
        <Button type="submit" variant="default">
          Enviar
        </Button>
      </div>
    </form>
  );
};
