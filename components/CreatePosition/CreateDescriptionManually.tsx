"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { EditableList } from "./EditableList";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { LocationSelector } from "./LocationSelector";
import { Dictionary } from "@/types/i18n";
import { Button } from "../ui/button";
import { BadgeInfo, ChevronRight, LogOut } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import {
  DraftPositionData,
  PositionConfigurationPhaseTypes,
  User,
} from "@/types";
import { Step, Stepper } from "./Stepper";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { useBusinesses } from "@/hooks/use-businesses";
import { StickyFooter } from "./StickyFooter";
import { useCompletePhase } from "@/hooks/use-complete-phase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useUsers } from "@/hooks/use-users";
import { Search } from "../CreateUserDialog/Search";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";

type CreateDescriptionManuallyProps = {
  dictionary: Dictionary;
};
export const CreateDescriptionManually: FC<
  Readonly<CreateDescriptionManuallyProps>
> = ({ dictionary }) => {
  const [recruiter, setRecruiter] = useState<User>();
  const [ownerPositionUser, setOwnerPositionUser] = useState<User>();
  const initialized = useRef(false);

  const params = useParams<{ lang: Locale; id: string; position_id: string }>();
  const [steps, setSteps] = useState<Step[]>([]);
  const router = useRouter();
  const { lang, id, position_id } = params;
  const { createPositionPage: i18n } = dictionary;
  const [salaryOption, setSalaryOption] = useState<
    "fixed" | "range" | "not-specified"
  >("fixed");
  const [positionData, setPositionData] = useState<DraftPositionData>();
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: positionConfiguration } = usePositionConfigurations({
    id: position_id,
    businessId: id,
  });

  const { users } = useUsers({
    businessId: id,
    all: true,
  });

  const { mutate: completePhase, isPending: isCompletePhasePending } =
    useCompletePhase({
      onSuccess: (data) => {
        console.info("Complete Phase success", data);
        router.push(
          `/${lang}/dashboard/companies/${id}/position-configuration/${position_id}`,
        );
      },
      onError: (error) => {
        console.error("Complete Phase error", error);
      },
    });
  const { businesses } = useBusinesses();
  const business = useMemo(() => {
    return businesses.find((b) => b._id === id);
  }, [id, businesses]);

  const formatSalaryRange = () => {
    if (!positionData) return "";
    try {
      const lowRange = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.salary?.currency || "USD",
      }).format(Number(positionData.salary?.salary_range?.min ?? "0"));
      const highRange = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.salary?.currency || "USD",
      }).format(Number(positionData.salary?.salary_range?.max ?? "0"));
      return ` ${lowRange} - ${highRange} ${positionData.salary?.currency}`;
    } catch (error) {
      console.error("Error formatting salary range", error);
      return ` ${positionData.salary?.salary_range?.min} - ${positionData.salary?.salary_range?.max} ${positionData.salary?.currency} `;
    }
  };

  const formatFixedSalary = () => {
    if (!positionData) return "";
    try {
      const salary = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: positionData.salary?.currency || "USD",
      }).format(Number(positionData.salary?.salary ?? "0"));

      return `${salary} `;
    } catch (error) {
      console.error("Error formatting fixed salary", error);
      return ` ${positionData.salary?.salary} ${positionData.salary?.currency} `;
    }
  };
  useEffect(() => {
    if (!initialized.current && positionData) {
      if (positionData.salary?.salary_range?.min) {
        setSalaryOption("range");
      } else if (positionData.salary?.salary) {
        setSalaryOption("fixed");
      } else {
        setSalaryOption("not-specified");
      }
      initialized.current = true;
    }
  }, [positionData]);
  useEffect(() => {
    const currentPosition = positionConfiguration?.body.data?.[0];
    if (currentPosition) {
      setSteps(
        currentPosition.phases.map((phase) => ({
          title: phase.name,
          status: phase.status,
          type: phase.type,
        })),
      );

      setPositionData(currentPosition.phases[0].data as DraftPositionData);
    }
  }, [positionConfiguration]);

  useEffect(() => {
    if (recruiter && positionData) {
      setPositionData({
        ...positionData,
        recruiter_user_id: recruiter._id,
      });
    }
  }, [recruiter]);

  useEffect(() => {
    if (ownerPositionUser && positionData) {
      setPositionData({
        ...positionData,
        owner_position_user_id: ownerPositionUser._id,
      });
    }
  }, [ownerPositionUser]);

  function isPositionDataComplete(data: typeof positionData): boolean {
    return (
      !!data &&
      typeof data.city === "string" &&
      data.city.trim() !== "" &&
      typeof data.role === "string" &&
      data.role.trim() !== "" &&
      typeof data.country_code === "string" &&
      data.country_code.trim() !== "" &&
      typeof data.description === "string" &&
      data.description.trim() !== "" &&
      Array.isArray(data.responsabilities) &&
      data.responsabilities.length > 0 &&
      Array.isArray(data.education) &&
      data.education.length > 0 &&
      Array.isArray(data.benefits) &&
      data.benefits.length > 0 &&
      Array.isArray(data.skills) &&
      data.skills.length > 0 &&
      typeof data.work_mode === "string" &&
      data.work_mode.trim() !== "" &&
      typeof data.seniority === "string" &&
      data.seniority.trim() !== "" &&
      typeof data.hiring_priority === "string" &&
      data.hiring_priority.trim() !== "" &&
      typeof data.recruiter_user_id === "string" &&
      data.recruiter_user_id.trim() !== "" &&
      business?.description?.trim() !== ""
    );
  }
  useEffect(() => {
    const allDataCompleted = isPositionDataComplete(positionData);

    setIsCompleted(allDataCompleted);
  }, [positionData]);
  console.log(
    "%c[Debug] ",
    "background-color: teal; font-size: 20px; color: white",
    positionData,
  );
  if (!positionData) return null;

  return (
    <TooltipProvider>
      <div className="mx-auto mb-14 w-full max-w-[60rem] space-y-8 p-6">
        <Button
          variant="outline"
          onClick={() => {
            router.push(
              `/${lang}/dashboard/positions?tab=drafts&business_id=${id}&position_id=${position_id}`,
            );
          }}
        >
          <LogOut />
          {i18n.exit}
        </Button>
        <div className="mx-auto flex w-fit min-w-[60rem] flex-col gap-7 rounded-md px-10 py-2 shadow-md">
          <Stepper
            phase={PositionConfigurationPhaseTypes.DESCRIPTION}
            steps={steps}
            setSteps={setSteps}
            i18n={i18n}
          />
        </div>
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              Nombre del cargo
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Para mejores resultados, usa el nombre genérico del cargo, no la
                versión interna de tu empresa.
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            placeholder="Ejemplo: Gerente de ventas"
            className="w-full text-4xl"
            value={positionData.role || ""}
            onChange={(e) =>
              setPositionData({ ...positionData, role: e.target.value })
            }
          />
        </div>
        {/* #1 - Reclutador responsable */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              👩🏼‍💼 Reclutador responsable
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Recomendamos que sea la persona experta en talento humano
                responsable de esta vacante.
              </TooltipContent>
            </Tooltip>
          </div>
          <Search
            setExistingUser={setRecruiter}
            placeholder="Buscar usuario"
            users={users}
          />
        </div>
        {/* #2 - Solicitante de la vacante */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              👨🏻‍💼 Solicitante de la vacante
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Recomendamos que sea quien pidió la vacante. Si no está en la
                lista,{" "}
                <Link
                  target="_blank"
                  href={`/${lang}/dashboard/companies/${id}?tab=users`}
                  className="text-blue-500"
                >
                  envíele invitación
                </Link>{" "}
                para que se una a Talent Connect.
              </TooltipContent>
            </Tooltip>
          </div>
          <Search
            setExistingUser={setOwnerPositionUser}
            placeholder="Buscar usuario"
            users={users}
          />
        </div>
        {/* #3 - Prioridad de contratación */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              {" "}
              ⚡️ Prioridad de contratación{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Define si la vacante es prioridad alta, media o baja.
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            name="hiring_priority"
            onValueChange={(value: string) => {
              setPositionData({ ...positionData, hiring_priority: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Prioridad de contratación" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[
                  { value: "high", label: "Alta" },
                  { value: "medium", label: "Media" },
                  { value: "low", label: "Baja" },
                ].map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* #4 - Descripción de la empresa */}
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              {" "}
              🌍 {i18n.aboutUsLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Use la descripción de la empresa. Si no está, complétela en{" "}
                <Link
                  target="_blank"
                  href={`/${lang}/dashboard/companies/${id}`}
                  className="text-blue-500"
                >
                  Configuración de la empresa
                </Link>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="cursor-text leading-relaxed text-gray-600">
            {business?.description}
          </p>
        </section>
        {/* #5 - Descripción de la vacante */}
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              {" "}
              💻 {i18n.jobDescriptionLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Describa la vacante de forma clara y persuasiva.
              </TooltipContent>
            </Tooltip>
          </div>
          <Textarea
            placeholder="Enter your description here"
            className="w-full"
            value={positionData.description}
            onChange={(e) =>
              setPositionData({ ...positionData, description: e.target.value })
            }
          />
        </section>
        {/* #6 - Ubicación */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              📍 {i18n.locationLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                País y ciudad donde debe estar ubicado el candidato.{" "}
              </TooltipContent>
            </Tooltip>
          </div>
          <LocationSelector
            fullWidth={true}
            dictionary={dictionary}
            defaultCity={positionData.city}
            defaultCountry={positionData.country_code}
            onCountryChange={(country) =>
              setPositionData({
                ...positionData,
                country_code: country.toUpperCase(),
              })
            }
            onCityChange={(city) =>
              setPositionData({ ...positionData, city: city })
            }
          />
        </div>
        {/* #7 - Modo de trabajo */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 💻 Modo de trabajo</h2>{" "}
            <span className="text-xs text-red-500">&nbsp;*</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Seleccione presencial, remoto o híbrido.{" "}
              </TooltipContent>
            </Tooltip>
          </div>
          <Select
            name="work_mode"
            onValueChange={(value: string) => {
              setPositionData({ ...positionData, work_mode: value });
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Modo de trabajo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[
                  { value: "REMOTE", label: "Remoto" },
                  { value: "ON_SITE", label: "Presencial" },
                  { value: "HYBRID", label: "Híbrido" },
                ].map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {/* #8 - Experiencia requerida */}
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              🧑‍💻 Experiencia requerida{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Tiempo y tipo de experiencia requerida. Si aplica, incluya el
                sector. Ej: <strong>3 años como KAM en Real Estate. </strong>
              </TooltipContent>
            </Tooltip>
          </div>
          <Input
            placeholder="Ejemplo: 5 años de experiencia en ventas"
            className="w-full"
            value={positionData.seniority || ""}
            onChange={(e) =>
              setPositionData({ ...positionData, seniority: e.target.value })
            }
          />
        </section>{" "}
        {/* #9 - Responsabilidades */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              🚀 {i18n.responsabilitiesLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Liste responsabilidades una a una. Enter para agregar otra.
              </TooltipContent>
            </Tooltip>
          </div>
          <EditableList
            items={positionData.responsabilities || []}
            onItemsChange={(items) =>
              setPositionData({ ...positionData, responsabilities: items })
            }
          />
        </div>
        {/* #10 - Habilidades */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              🎯 {i18n.skillsLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Liste habilidades clave. Enter para agregar otra.{" "}
              </TooltipContent>
            </Tooltip>
          </div>
          <EditableList
            items={positionData.skills?.map((skill) => skill.name) || []}
            onItemsChange={(items) =>
              setPositionData({
                ...positionData,
                skills: items.map((item) => ({ name: item, required: false })),
              })
            }
          />
        </div>
        {/* #11 - Educación */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              🎓 {i18n.educationLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Liste estudios requeridos. Enter para agregar otro.
              </TooltipContent>
            </Tooltip>
          </div>
          <EditableList
            items={positionData.education ?? []}
            onItemsChange={(items) =>
              setPositionData({ ...positionData, education: items })
            }
          />
        </div>
        {/* #12 - Idioma y Nivel */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              🌐 Idioma requerido{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Idioma y nivel requerido. Puede agregar varios.
              </TooltipContent>
            </Tooltip>
          </div>
          <div className="flex flex-col gap-2">
            {positionData.languages?.map((lang, idx) => (
              <div key={idx} className="flex items-end gap-2">
                <div className="flex-1">
                  <Label htmlFor={`language-${idx}`}>Idioma</Label>
                  <Input
                    id={`language-${idx}`}
                    placeholder="Ej: Inglés, Francés, Italiano…"
                    value={lang.name}
                    onChange={(e) => {
                      const newLanguages = [...positionData.languages];
                      newLanguages[idx] = {
                        ...newLanguages[idx],
                        name: e.target.value,
                      };
                      setPositionData({
                        ...positionData,
                        languages: newLanguages,
                      });
                    }}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`level-${idx}`}>Nivel</Label>
                  <Input
                    id={`level-${idx}`}
                    placeholder="Ej: principiante, intermedio, avanzado…"
                    value={lang.level}
                    onChange={(e) => {
                      const newLanguages = [...positionData.languages];
                      newLanguages[idx] = {
                        ...newLanguages[idx],
                        level: e.target.value,
                      };
                      setPositionData({
                        ...positionData,
                        languages: newLanguages,
                      });
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  className="mb-1"
                  disabled={positionData.languages.length === 1}
                  onClick={() => {
                    const newLanguages = positionData.languages.filter(
                      (_, i) => i !== idx,
                    );
                    setPositionData({
                      ...positionData,
                      languages: newLanguages,
                    });
                  }}
                >
                  Eliminar
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPositionData({
                  ...positionData,
                  languages: [
                    ...(positionData.languages || []),
                    { name: "", level: "" },
                  ],
                });
              }}
            >
              Agregar idioma
            </Button>
          </div>
        </div>
        {/* #13 - Salario */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              {" "}
              💰{i18n.salaryRangeLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Ingrese un valor mensual, un rango o márquelo como confidencial
                para compartirlo durante el proceso
              </TooltipContent>
            </Tooltip>
          </div>
          <>
            <Select
              name="currency"
              onValueChange={(value: string) => {
                setPositionData({
                  ...positionData,
                  salary: {
                    salary: positionData?.salary?.salary ?? null,
                    currency: value,
                    salary_range: positionData?.salary?.salary_range ?? null,
                  },
                });
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Moneda" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[
                    {
                      value: "PEN",
                      label: "Sol peruano",
                    },
                    {
                      value: "COP",
                      label: "Peso colombiano",
                    },
                    {
                      value: "MXN",
                      label: "Peso mexicano",
                    },
                    {
                      value: "USD",
                      label: "Dólar estadounidense",
                    },
                    {
                      value: "EUR",
                      label: "Euro",
                    },
                  ].map((currency, idx) => (
                    <SelectItem key={idx} value={currency.value}>
                      {currency.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <RadioGroup
              onValueChange={(value: "fixed" | "range" | "not-specified") => {
                setSalaryOption(value);
                if (value === "not-specified") {
                  setPositionData({
                    ...positionData,
                    salary: {
                      currency: positionData?.salary?.currency ?? "USD",
                      salary: null,
                      salary_range: null,
                    },
                  });
                }
              }}
              defaultValue={salaryOption}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="range" id="range" />
                <Label htmlFor="range">{i18n.rangeLabel}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fixed" id="fixed" />
                <Label htmlFor="fixed">{i18n.fixedSalaryLabel}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="not-specified" id="not-specified" />
                <Label htmlFor="not-specified">
                  {i18n.salaryNotSpecifiedLabel}
                </Label>
              </div>
            </RadioGroup>
            {salaryOption === "range" && (
              <div className="space-y-4 text-gray-600">
                <div className="flex gap-2">
                  <Input
                    value={positionData?.salary?.salary_range?.min ?? "0"}
                    placeholder="Mínimo"
                    type="text"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*)\./g, "$1");
                      setPositionData({
                        ...positionData,
                        salary: {
                          currency: positionData?.salary?.currency ?? "USD",
                          salary: null,
                          salary_range: {
                            ...positionData.salary?.salary_range,
                            min: value,
                          },
                        },
                      });
                    }}
                  />
                  <Input
                    value={positionData?.salary?.salary_range?.max ?? "0"}
                    placeholder="Máximo"
                    type="text"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*)\./g, "$1");
                      setPositionData({
                        ...positionData,
                        salary: {
                          currency: positionData?.salary?.currency ?? "USD",
                          salary: null,
                          salary_range: {
                            ...positionData.salary?.salary_range,
                            max: value,
                          },
                        },
                      });
                    }}
                  />
                </div>
                <p>
                  📌 {i18n.salaryDescriptionStart}
                  {formatSalaryRange()} {i18n.salaryDescriptionEnd}
                </p>
              </div>
            )}

            {salaryOption === "fixed" && (
              <div className="space-y-4 text-gray-600">
                <div className="flex gap-2">
                  <Input
                    value={positionData?.salary?.salary ?? "0"}
                    placeholder="Salario"
                    type="text"
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9.]/g, "")
                        .replace(/(\..*)\./g, "$1");
                      setPositionData({
                        ...positionData,
                        salary: {
                          currency: positionData?.salary?.currency ?? "USD",
                          salary: value,
                          salary_range: undefined,
                        },
                      });
                    }}
                  />
                </div>
                <p>
                  📌 {i18n.fixedsalaryDescriptionStart} {formatFixedSalary()}
                  {i18n.salaryDescriptionEnd}
                </p>
              </div>
            )}

            {salaryOption === "not-specified" && (
              <div className="space-y-4 text-gray-600">
                <p>📌 {i18n.salaryNotSpecified}</p>
              </div>
            )}
          </>
        </div>
        {/* #14 - Beneficios */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>
              🎁 {i18n.whatWeOfferLabel}{" "}
              <span className="text-xs text-red-500">&nbsp;*</span>
            </h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <BadgeInfo className="h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="max-w-[260px] text-sm font-normal"
              >
                Liste beneficios uno a uno. Enter para agregar otro.
              </TooltipContent>
            </Tooltip>
          </div>
          <EditableList
            items={positionData.benefits || []}
            onItemsChange={(items) =>
              setPositionData({ ...positionData, benefits: items })
            }
          />
        </div>
        <StickyFooter
          onCancel={() => {}}
          showCancelButton={false}
          canSave={isCompleted}
          cancelLabel={i18n.cancelLabel}
          saveLabel={`${i18n.continuedNextPhase} 2`}
          isSaving={isCompletePhasePending}
          onSave={() => {
            completePhase({
              position_configuration_id: position_id,
              data: { ...positionData, responsible_users: [] },
            });
          }}
          saveButtonIcon={<ChevronRight className="h-4 w-4" />}
        />
      </div>
    </TooltipProvider>
  );
};
