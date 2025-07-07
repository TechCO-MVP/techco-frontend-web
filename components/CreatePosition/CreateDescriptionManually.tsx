"use client";

import { FC, useEffect, useMemo, useState } from "react";
import { Textarea } from "../ui/textarea";
import { EditableList } from "./EditableList";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { LocationSelector } from "./LocationSelector";
import { Dictionary } from "@/types/i18n";
import { Button } from "../ui/button";
import { ChevronRight, LogOut } from "lucide-react";
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

type CreateDescriptionManuallyProps = {
  dictionary: Dictionary;
};
export const CreateDescriptionManually: FC<
  Readonly<CreateDescriptionManuallyProps>
> = ({ dictionary }) => {
  const [recruiter, setRecruiter] = useState<User>();
  const [ownerPositionUser, setOwnerPositionUser] = useState<User>();

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
      data.recruiter_user_id.trim() !== ""
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
          <h2> Nombre del cargo</h2>
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
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2>📍 {i18n.locationLabel}</h2>
        </div>
        <LocationSelector
          fullWidth={true}
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
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 Modo de trabajo</h2>
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
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> ⚡️ Prioridad de contratación</h2>
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
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 👨🏻‍💼 Reclutador responsable</h2>
        </div>
        <Search
          setExistingUser={setRecruiter}
          placeholder="Buscar usuario"
          users={users}
        />
      </div>
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 👨🏻‍💼 Encargado de la posición</h2>
          <p className="text-sm text-gray-500">
            Lo ideal es que sea la persona de la empresa que necesita cubrir
            este cargo.
          </p>
        </div>
        <Search
          setExistingUser={setOwnerPositionUser}
          placeholder="Buscar usuario"
          users={users}
        />
      </div>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 🌍 {i18n.aboutUsLabel}</h2>
        </div>
        <p className="cursor-text leading-relaxed text-gray-600">
          {business?.description}
        </p>
      </section>
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💻 {i18n.jobDescriptionLabel} </h2>
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
      <section className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2>🧑‍💻 Experiencia requerida </h2>
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
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🚀 {i18n.responsabilitiesLabel}</h2>
        </div>
        <EditableList
          items={positionData.responsabilities || []}
          onItemsChange={(items) =>
            setPositionData({ ...positionData, responsabilities: items })
          }
        />
      </div>
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎓 {i18n.educationLabel}</h2>
        </div>
        <EditableList
          items={positionData.education ?? []}
          onItemsChange={(items) =>
            setPositionData({ ...positionData, education: items })
          }
        />
      </div>
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎯 {i18n.skillsLabel}</h2>
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
      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💰{i18n.salaryRangeLabel}</h2>
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
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎁 {i18n.whatWeOfferLabel}</h2>
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
            data: positionData,
          });
        }}
        saveButtonIcon={<ChevronRight className="h-4 w-4" />}
      />
    </div>
  );
};
