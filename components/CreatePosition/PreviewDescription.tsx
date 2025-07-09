"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { countryNameLookup } from "@/lib/utils";
import { usePositionConfigurations } from "@/hooks/use-position-configurations";
import { useParams, useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { useBusinesses } from "@/hooks/use-businesses";
import { Step, Stepper } from "./Stepper";
import { Dictionary } from "@/types/i18n";
import { Button } from "../ui/button";
import { EditIcon } from "@/icons";
import {
  DraftPositionData,
  PositionConfigurationPhaseTypes,
  PositionPhase,
  User,
} from "@/types";
import { Textarea } from "../ui/textarea";
import { EditableList } from "./EditableList";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { LocationSelector } from "./LocationSelector";
import { StickyFooter } from "./StickyFooter";
import { BadgeInfo, ChevronRight, LogOut } from "lucide-react";
import { useUpdatePositionConfiguration } from "@/hooks/use-update-position-configuration";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useUsers } from "@/hooks/use-users";
import { useToast } from "@/hooks/use-toast";
import _ from "lodash";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useCompletePhase } from "@/hooks/use-complete-phase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Search } from "../CreateUserDialog/Search";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Link from "next/link";

type Props = {
  dictionary: Dictionary;
};
export const PreviewDescription: FC<Props> = ({ dictionary }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [salaryOption, setSalaryOption] = useState<
    "fixed" | "range" | "not-specified"
  >("fixed");
  const [steps, setSteps] = useState<Step[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<PositionPhase>();
  const [mode, setMode] = useState<"preview" | "edit">("preview");
  const [positionData, setPositionData] = useState<DraftPositionData>();
  const initialData = useRef<DraftPositionData>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isDirty = !_.isEqual(positionData, initialData.current);
  const router = useRouter();
  const [recruiter, setRecruiter] = useState<User>();
  const [ownerPositionUser, setOwnerPositionUser] = useState<User>();

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
  const { createPositionPage: i18n } = dictionary;
  const { mutate: saveDraft, isPending } = useUpdatePositionConfiguration({
    onSuccess: (data) => {
      console.info("Save Draft success", data);
      toast({
        description: i18n.changesSavedMessage,
      });
      initialData.current = null;
      queryClient.invalidateQueries({
        queryKey: QUERIES.POSITION_CONFIG_LIST_ALL,
      });
      setMode("preview");
    },
    onError: (error) => {
      console.error("Save Draft error", error);
    },
  });

  const params = useParams<{
    lang: Locale;
    id: string;
    position_id: string;
  }>();

  const { position_id, id, lang } = params;

  const { businesses } = useBusinesses();
  const business = useMemo(() => {
    return businesses.find((b) => b._id === id);
  }, [id, businesses]);
  const { data: positionConfiguration } = usePositionConfigurations({
    id: position_id,
    businessId: id,
  });
  console.log("positionConfiguration", positionConfiguration);
  const { currentUser } = useCurrentUser();
  const { localUser, users } = useUsers({
    businessId: id,
    email: currentUser?.email,
  });

  const currentPosition = useMemo(() => {
    return positionConfiguration?.body.data.find(
      (position) => position._id === position_id,
    );
  }, [positionConfiguration, position_id]);
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
      setCurrentPhase(currentPosition.phases[0]);
      setPositionData(currentPosition.phases[0].data as DraftPositionData);
    }
  }, [positionConfiguration]);

  const descriptionPhase = useMemo(() => {
    return currentPosition?.phases.find(
      (phase) => phase.type === PositionConfigurationPhaseTypes.DESCRIPTION,
    );
  }, [currentPosition]);

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
      Array.isArray(data.benefits) &&
      data.benefits.length > 0 &&
      Array.isArray(data.skills) &&
      data.skills.length > 0 &&
      typeof data.work_mode === "string" &&
      data.work_mode.trim() !== "" &&
      typeof data.seniority === "string" &&
      data.seniority.trim() !== "" &&
      business?.description?.trim() !== ""
    );
  }
  useEffect(() => {
    if (positionData && !initialData.current) {
      initialData.current = positionData;
    }
    const allDataCompleted = isPositionDataComplete(positionData);

    setIsCompleted(allDataCompleted);
  }, [positionData]);

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

  useEffect(() => {
    console.log(
      "%c[Debug] positionData",
      "background-color: teal; font-size: 20px; color: white",
      positionData,
    );
  }, [positionData]);

  useEffect(() => {
    if (isDirty) return;

    if (positionData?.salary?.salary_range?.min) {
      setSalaryOption("range");
    } else if (positionData?.salary?.salary) {
      setSalaryOption("fixed");
    } else {
      setSalaryOption("not-specified");
    }
  }, [positionData, isDirty]);

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
      return ` ${lowRange} - ${highRange} ${positionData.salary?.currency}`;
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

      return `${salary} `;
    } catch (error) {
      console.error("Error formatting fixed salary", error);
      return ` ${positionData.salary?.salary} ${positionData.salary?.currency} `;
    }
  };

  const checkUnsavedChanges = () => {
    if (!isDirty) {
      setMode("preview");
      return;
    }
    setDialogOpen(true);
  };

  const onSaveDraft = () => {
    if (!localUser || !currentPhase) return;
    if (!currentPosition) return;
    saveDraft({
      ...currentPosition,
      phases:
        currentPosition?.phases.map((phase) =>
          phase.name === currentPhase?.name
            ? {
                ...phase,
                data: positionData,
              }
            : phase,
        ) ?? [],
    });
  };

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

        <div className="flex items-center justify-between">
          {mode === "preview" ? (
            <h1 className="text-4xl font-bold">{positionData.role}</h1>
          ) : (
            <Input
              className="text-4xl font-bold"
              value={positionData.role}
              onChange={(e) =>
                setPositionData({ ...positionData, role: e.target.value })
              }
            />
          )}
          <div className="flex gap-2">
            {mode === "preview" && (
              <Button
                onClick={() => {
                  if (currentPhase?.status === "DRAFT") {
                    router.push(
                      `/${lang}/dashboard/companies/${id}/positions/${position_id}`,
                    );
                  } else {
                    setMode("edit");
                  }
                }}
                variant="outline"
              >
                <EditIcon />
                {currentPhase?.status === "DRAFT"
                  ? i18n.continueEditing
                  : i18n.editDescription}
              </Button>
            )}
          </div>
        </div>
        {/* #1 - Reclutador responsable */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 👨🏻‍💼 Reclutador responsable</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <p className="cursor-text leading-relaxed text-gray-600">
              {recruiter?.full_name}
            </p>
          ) : (
            <Search
              setExistingUser={setRecruiter}
              placeholder="Buscar usuario"
              users={users}
            />
          )}
        </div>
        {/* #2 - Solicitante de la vacante */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 👨🏻‍💼 Solicitante de la vacante</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <p className="cursor-text leading-relaxed text-gray-600">
              {ownerPositionUser?.full_name || localUser?.full_name}
            </p>
          ) : (
            <Search
              setExistingUser={setOwnerPositionUser}
              placeholder="Buscar usuario"
              users={users}
            />
          )}
        </div>
        {/* #3 - Prioridad de contratación */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> ⚡️ Prioridad de contratación</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <p className="cursor-text leading-relaxed text-gray-600">
              {positionData.hiring_priority}
            </p>
          ) : (
            <Select
              value={positionData.hiring_priority}
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
          )}
        </div>
        {/* #4 - Descripción de la empresa */}
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 🌍 {i18n.aboutUsLabel}</h2>
            {mode === "edit" && (
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
            )}
          </div>
          <p className="cursor-text leading-relaxed text-gray-600">
            {business?.description}
          </p>
        </section>

        {/* #5 - Descripción de la vacante */}
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 💻 {i18n.jobDescriptionLabel} </h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <p className="cursor-text leading-relaxed text-gray-600">
              {positionData.description}
            </p>
          ) : (
            <Textarea
              placeholder="Enter your description here"
              className="w-full"
              value={positionData.description}
              onChange={(e) =>
                setPositionData({
                  ...positionData,
                  description: e.target.value,
                })
              }
            />
          )}
        </section>
        {/* #6 - Ubicación */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 📍 {i18n.locationLabel} </h2>{" "}
            {mode === "edit" && (
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
            )}
          </div>

          {mode === "preview" ? (
            <span>
              {positionData.city} /
              {countryNameLookup(positionData.country_code || "CO")}
            </span>
          ) : (
            <LocationSelector
              dictionary={dictionary}
              defaultCity={positionData.city}
              defaultCountry={positionData.country_code}
              onCountryChange={(country) =>
                setPositionData({ ...positionData, country_code: country })
              }
              onCityChange={(city) =>
                setPositionData({ ...positionData, city: city })
              }
            />
          )}
        </div>
        {/* #7 - Modo de trabajo */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 💻 Modo de trabajo</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <p className="cursor-text leading-relaxed text-gray-600">
              {positionData.work_mode}
            </p>
          ) : (
            <Select
              value={positionData.work_mode}
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
                    { value: "HYBRYD", label: "Híbrido" },
                  ].map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        {/* #8 - Experiencia requerida */}
        <section className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>🧑‍💻 Experiencia requerida </h2>
            {mode === "edit" && (
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
            )}
          </div>
          <p className="cursor-text leading-relaxed text-gray-600">
            {positionData.seniority}
          </p>
        </section>
        {/* #9 - Responsabilidades */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>🚀 {i18n.responsabilitiesLabel}</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <ul className="list-disc space-y-1 pl-6">
              {positionData.responsabilities?.map((item, idx) => (
                <li key={idx} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <EditableList
              items={positionData.responsabilities}
              onItemsChange={(items) =>
                setPositionData({ ...positionData, responsabilities: items })
              }
            />
          )}
        </div>

        {/* #10 - Habilidades */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>🎯 {i18n.skillsLabel}</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <ul className="list-disc space-y-1 pl-6">
              {positionData.skills?.map((item, idx) => (
                <li key={idx} className="text-gray-600">
                  {item.name}
                </li>
              ))}
            </ul>
          ) : (
            <EditableList
              items={positionData.skills.map((skill) => skill.name)}
              onItemsChange={(items) =>
                setPositionData({
                  ...positionData,
                  skills: items.map((item) => ({
                    name: item,
                    required: false,
                  })),
                })
              }
            />
          )}
        </div>

        {/* #11 - Educación */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>🎓 {i18n.educationLabel}</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <ul className="list-disc space-y-1 pl-6">
              {positionData.education?.map((item, idx) => (
                <li key={idx} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <EditableList
              items={positionData.education ?? []}
              onItemsChange={(items) =>
                setPositionData({ ...positionData, education: items })
              }
            />
          )}
        </div>

        {/* #12 - Idioma y Nivel */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>🌐 Idioma requerido</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            positionData.languages &&
            positionData.languages.length > 0 &&
            positionData.languages.some((l) => l.name || l.level) ? (
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
            ) : (
              <p className="text-gray-400">
                No se especificó idioma requerido.
              </p>
            )
          ) : (
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
          )}
        </div>

        {/* #13 - Salario */}
        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2> 💰{i18n.salaryRangeLabel}</h2>
            {mode === "edit" && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <BadgeInfo className="h-4 w-4 cursor-help" />
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  className="max-w-[260px] text-sm font-normal"
                >
                  Ingrese un valor mensual, un rango o márquelo como
                  confidencial para compartirlo durante el proceso
                </TooltipContent>
              </Tooltip>
            )}
          </div>
          {mode === "preview" ? (
            <>
              {salaryOption === "range" && (
                <div className="space-y-4 text-gray-600">
                  <p>
                    📌 {i18n.salaryDescriptionStart}
                    {formatSalaryRange()} {i18n.salaryDescriptionEnd}
                  </p>
                </div>
              )}

              {salaryOption === "fixed" && (
                <div className="space-y-4 text-gray-600">
                  <p>
                    📌 {i18n.fixedsalaryDescriptionStart} {formatFixedSalary()}
                    {i18n.salaryDescriptionEnd}.
                  </p>
                </div>
              )}

              {salaryOption === "not-specified" && (
                <div className="space-y-4 text-gray-600">
                  <p>📌 {i18n.salaryNotSpecified}</p>
                </div>
              )}
            </>
          ) : (
            <>
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
          )}
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 font-semibold">
            <h2>🎁 {i18n.whatWeOfferLabel}</h2>
            {mode === "edit" && (
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
            )}
          </div>
          {mode === "preview" ? (
            <ul className="list-disc space-y-1 pl-6">
              {positionData.benefits?.map((item, idx) => (
                <li key={idx} className="text-gray-600">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <EditableList
              items={positionData.benefits}
              onItemsChange={(items) =>
                setPositionData({ ...positionData, benefits: items })
              }
            />
          )}
        </div>

        {mode === "edit" && (
          <StickyFooter
            canSave={isDirty}
            cancelLabel={i18n.cancelLabel}
            saveLabel={i18n.saveLabel}
            isSaving={isPending}
            onCancel={() => {
              checkUnsavedChanges();
            }}
            onSave={() => onSaveDraft()}
          />
        )}
        {mode !== "edit" &&
          isCompleted &&
          descriptionPhase?.status !== "COMPLETED" && (
            <StickyFooter
              showCancelButton={false}
              canSave={isCompleted}
              cancelLabel={i18n.cancelLabel}
              saveLabel={`${i18n.continuedNextPhase} 2`}
              isSaving={isCompletePhasePending || isPending}
              onCancel={() => {
                checkUnsavedChanges();
              }}
              onSave={() => {
                if (descriptionPhase?.status === "COMPLETED") {
                  onSaveDraft();
                } else {
                  completePhase({
                    position_configuration_id: position_id,
                    data: positionData,
                  });
                }
              }}
              saveButtonIcon={<ChevronRight className="h-4 w-4" />}
            />
          )}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{i18n.cancelEditDialogTitle}</DialogTitle>
              <DialogDescription>
                {i18n.cancelEditDialogDescription}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                {i18n.cancelEditDialogCancel}
              </Button>
              <Button
                onClick={() => {
                  setDialogOpen(false);
                  setMode("preview");
                  setPositionData(initialData.current as DraftPositionData);
                }}
              >
                {i18n.cancelEditDialogConfirm}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  );
};
