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
} from "@/types";
import { Textarea } from "../ui/textarea";
import { EditableList } from "./EditableList";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { LocationSelector } from "./LocationSelector";
import { StickyFooter } from "./StickyFooter";
import { ChevronRight, LogOut } from "lucide-react";
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
        queryKey: QUERIES.POSITION_CONFIG_LIST(id),
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
  const { businesses, rootBusiness } = useBusinesses();
  const business = useMemo(() => {
    return businesses.find((b) => b._id === id);
  }, [id, businesses]);
  const { data: positionConfiguration } = usePositionConfigurations({
    id: position_id,
    businessId: id,
  });
  console.log("positionConfiguration", positionConfiguration);
  const { currentUser } = useCurrentUser();
  const { localUser } = useUsers({
    businessId: rootBusiness?._id,
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

  console.log(
    "%c[Debug] descriptionPhase",
    "background-color: teal; font-size: 20px; color: white",
    descriptionPhase,
  );

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
      data.seniority.trim() !== ""
    );
  }
  useEffect(() => {
    if (positionData && !initialData.current) {
      initialData.current = positionData;
    }
    const allDataCompleted = isPositionDataComplete(positionData);
    setIsCompleted(Boolean(allDataCompleted));
  }, [positionData]);

  useEffect(() => {
    if (positionData?.salary?.salary_range?.min) {
      setSalaryOption("range");
    } else if (positionData?.salary?.salary) {
      setSalaryOption("fixed");
    } else {
      setSalaryOption("not-specified");
    }
  }, [positionData]);

  if (!positionData) return null;

  const formatSalaryRange = () => {
    const lowRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary_range?.min ?? 0));
    const highRange = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary_range?.max ?? 0));
    return `${lowRange} - ${highRange} ${positionData.salary?.currency}`;
  };

  const formatFixedSalary = () => {
    const salary = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: positionData.salary?.currency || "USD",
    }).format(Number(positionData.salary?.salary));

    return `${salary}`;
  };

  const checkUnsavedChanges = () => {
    if (!isDirty) {
      setMode("preview");
      return;
    }
    setDialogOpen(true);
  };

  const onSaveDraft = () => {
    if (!localUser || !currentPhase || !currentPhase.thread_id) return;
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
        <h1 className="text-4xl font-bold">{positionData.role} </h1>
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
      <div className="flex items-center gap-2 text-gray-600">
        {mode === "preview" ? (
          <span>
            📍 {i18n.locationLabel}: {positionData.city} /
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
              setPositionData({ ...positionData, description: e.target.value })
            }
          />
        )}
      </section>
      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🚀 {i18n.responsabilitiesLabel}</h2>
        </div>
        {mode === "preview" ? (
          <ul className="list-disc space-y-1 pl-6">
            {positionData.responsabilities?.map((item, idx) => (
              <li key={idx} className="capitalize text-gray-600">
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

      <div className="w-full space-y-3">
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎯 {i18n.skillsLabel}</h2>
        </div>
        {mode === "preview" ? (
          <ul className="list-disc space-y-1 pl-6">
            {positionData.skills?.map((item, idx) => (
              <li key={idx} className="capitalize text-gray-600">
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
                skills: items.map((item) => ({ name: item, required: false })),
              })
            }
          />
        )}
      </div>

      <div className="w-full space-y-3">
        <div className="flex items-center gap-2 font-semibold">
          <h2> 💰{i18n.salaryRangeLabel}</h2>
        </div>
        {mode === "preview" ? (
          <>
            {positionData.salary?.salary_range && (
              <div className="space-y-4 text-gray-600">
                <p>
                  📌 {i18n.salaryDescriptionStart}
                  {formatSalaryRange()} {i18n.salaryDescriptionEnd}
                </p>
              </div>
            )}

            {positionData.salary?.salary && positionData.salary?.salary > 0 && (
              <div className="space-y-4 text-gray-600">
                <p>
                  📌 {i18n.fixedsalaryDescriptionStart} {formatFixedSalary()}
                  {i18n.salaryDescriptionEnd}.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <RadioGroup
              onValueChange={(value: "fixed" | "range" | "not-specified") =>
                setSalaryOption(value)
              }
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
                    defaultValue={positionData.salary.salary_range?.min ?? 0}
                    placeholder="Mínimo"
                    type="number"
                    onChange={(e) =>
                      setPositionData({
                        ...positionData,
                        salary: {
                          ...positionData.salary,
                          salary_range: {
                            ...positionData.salary?.salary_range,
                            min: parseInt(e.target.value),
                          },
                        },
                      })
                    }
                  />
                  <Input
                    defaultValue={positionData.salary.salary_range?.max ?? 0}
                    placeholder="Máximo"
                    type="number"
                    onChange={(e) =>
                      setPositionData({
                        ...positionData,
                        salary: {
                          ...positionData.salary,
                          salary_range: {
                            ...positionData.salary?.salary_range,
                            max: parseInt(e.target.value),
                          },
                        },
                      })
                    }
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
                    defaultValue={positionData.salary.salary}
                    placeholder="Salario"
                    type="number"
                    onChange={(e) =>
                      setPositionData({
                        ...positionData,
                        salary: {
                          currency: positionData.salary.currency,
                          salary: parseInt(e.target.value),
                        },
                      })
                    }
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
        <div className="flex flex-col gap-2 font-semibold">
          <h2>🎁 {i18n.whatWeOfferLabel}</h2>
        </div>
        {mode === "preview" ? (
          <ul className="list-disc space-y-1 pl-6">
            {positionData.benefits?.map((item, idx) => (
              <li key={idx} className="capitalize text-gray-600">
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
      {mode !== "edit" && isCompleted && (
        <StickyFooter
          showCancelButton={false}
          canSave={isCompleted}
          cancelLabel={i18n.cancelLabel}
          saveLabel={
            descriptionPhase?.status === "COMPLETED"
              ? `Guardar Cambios`
              : `${i18n.continuedNextPhase} 2`
          }
          isSaving={isCompletePhasePending}
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
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {i18n.cancelEditDialogCancel}
            </Button>
            <Button onClick={onSaveDraft}>
              {i18n.cancelEditDialogConfirm}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
