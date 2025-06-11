"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  PHASE_NAMES,
  PositionConfigurationPhaseTypes,
  PositionData,
} from "@/types";
import Image from "next/image";
import { Text } from "../Typography/Text";
import { DetailsSheet } from "../PositionDetailsPage/DetailsSheet";
import { useUpdateHiringProcessCustomFields } from "@/hooks/use-update-hiring-process-custom-fields";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
type ApplicationFormProps = {
  dictionary: Dictionary;
  positionData: PositionData;
};
export const ApplicationForm: FC<Readonly<ApplicationFormProps>> = ({
  dictionary,
  positionData,
}) => {
  const { createPositionPage: i18n } = dictionary;
  const [, setSelectedDialCode] = useState("+51");
  const { footer } = dictionary;
  const [expectedSalary, setExpectedSalary] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([
    {
      title: i18n.descriptionStep,
      status: "COMPLETED",
      type: PositionConfigurationPhaseTypes.DESCRIPTION,
    },
    {
      title: i18n.softSkillsStep,
      status: "IN_PROGRESS",
      type: PositionConfigurationPhaseTypes.SOFT_SKILLS,
    },
    {
      title: i18n.technicalSkillsStep,
      status: "DRAFT",
      type: PositionConfigurationPhaseTypes.TECHNICAL_TEST,
    },
    {
      title: i18n.publishedStep,
      status: "DRAFT",
      type: PositionConfigurationPhaseTypes.READY_TO_PUBLISH,
    },
  ]);

  const { card } = usePipefyCard({
    cardId: positionData.hiring_card_id,
  });

  const { mutate: moveCardToPhase } = useMoveCardToPhase({
    onSuccess: (data) => {
      console.log("Card moved to phase", data);
    },
    onError: (error) => {
      console.error("Error moving card to phase", error);
    },
  });

  const nextPhase = card?.pipe.phases.find(
    (phase) => phase.name === PHASE_NAMES.INITIAL_FILTER,
  );

  const { mutate: updateHiringProcessCustomFields } =
    useUpdateHiringProcessCustomFields({
      onSuccess: () => {
        if (nextPhase) {
          moveCardToPhase({
            cardId: positionData.hiring_card_id,
            destinationPhaseId: nextPhase.id,
          });
        }
      },
      onError: (error) => {
        console.error("Error updating hiring process custom fields", error);
      },
    });

  const handleUpdateHiringProcessCustomFields = (
    customFields: Record<string, unknown>,
  ) => {
    if (!card?.current_phase.id) return;

    updateHiringProcessCustomFields({
      id: positionData.hiring_id,
      phases: {
        [card.current_phase.id]: {
          phase_id: card.current_phase.id,
          custom_fields: customFields,
        },
      },
    });
  };

  console.log(
    "%c[Debug] positionData",
    "background-color: teal; font-size: 20px; color: white",
    positionData,
  );

  // State to track true/false for each skill
  const [skillAnswers, setSkillAnswers] = useState<
    Record<string, boolean | undefined>
  >({});

  const handleSkillChange = (skillName: string, value: boolean) => {
    setSkillAnswers((prev) => ({
      ...prev,
      [skillName]: prev[skillName] === value ? undefined : value,
    }));
  };

  // State to track true/false for each responsibility
  const [responsibilityAnswers, setResponsibilityAnswers] = useState<
    Record<string, boolean | undefined>
  >({});

  const handleResponsibilityChange = (resp: string, value: boolean) => {
    setResponsibilityAnswers((prev) => ({
      ...prev,
      [resp]: prev[resp] === value ? undefined : value,
    }));
  };

  const sendApplication = () => {
    handleUpdateHiringProcessCustomFields({
      responsibilities: responsibilityAnswers,
      skills: skillAnswers,
      expected_salary: expectedSalary,
    });
  };

  // Compute if all checkboxes are selected (no undefined values)
  const allSkillsAnswered = positionData.position_skills.every(
    (skill) => typeof skillAnswers[skill.name] === "boolean",
  );
  const allResponsibilitiesAnswered =
    positionData.position_responsabilities.every(
      (resp) => typeof responsibilityAnswers[resp] === "boolean",
    );
  const canSubmit =
    allSkillsAnswered && allResponsibilitiesAnswered && expectedSalary;

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center bg-gray-50">
      <header className="w-full px-20 py-8">
        <nav className="flex items-center justify-between">
          <Image
            priority
            width={152}
            height={36}
            src="/assets/talent_connect.svg"
            alt="TechCo"
          />
        </nav>
        <ul className="flex justify-end space-x-4">
          <li>
            <DetailsSheet
              customTrigger={
                <Button
                  variant="outline"
                  className="rounde-md border-talent-green-800 bg-transparent text-talent-green-800 hover:bg-talent-green-800 hover:text-white"
                >
                  Ver detalles de la oferta
                </Button>
              }
              positionData={positionData}
              dictionary={dictionary}
            />
          </li>
        </ul>
      </header>
      <div
        className="min-h-100vh flex h-full min-h-screen w-full flex-col justify-center bg-gray-50 pb-20"
        style={{
          backgroundImage: "url('/assets/background.jpeg')",
          backgroundBlendMode: "lighten",
          backgroundColor: "rgba(255,255,255,0.8)",
        }}
      >
        <div className="mx-auto flex w-[75vw] flex-col overflow-y-auto overflow-x-hidden border-b-[5px] border-b-talent-orange-500 bg-white px-4 py-12 shadow-talent-green">
          {/* Progress Tracker */}
          <div className="mx-auto mb-12 flex max-w-3xl flex-col gap-7 overflow-hidden px-10 py-8 shadow-md">
            <Stepper steps={steps} setSteps={setSteps} i18n={i18n} />
          </div>
          <div className="mb-12 h-[1px] w-full bg-gray-200"></div>

          {/* Welcome Section */}
          <div className="mb-8 px-28">
            <h1 className="mb-2 text-3xl font-bold">
              ¡Bienvenid@, {positionData.hiring_profile_name}!
            </h1>
            <p className="mb-2 text-lg">
              ¡Estamos listos para conocerte mejor!
            </p>
            <p className="mb-4 text-sm text-gray-600">
              Queremos asegurarnos de tener toda la información importante para
              continuar con tu proceso de selección. Tómate unos minutos para
              completar estos datos.
            </p>
          </div>

          {/* Contact Information */}
          <div className="mb-8 px-28">
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
          <div className="mb-8 px-28">
            <h3 className="mb-2 text-sm">
              ¿Con cuáles de estas habilidades cuentas? (Selecciona una opción
              para cada habilidad)
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {positionData.position_skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <p className="mb-1 text-sm">
                    {skill.name}
                    {skill.required && (
                      <span className="ml-1 text-red-500">*</span>
                    )}
                  </p>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill.name}-yes`}
                        checked={skillAnswers[skill.name] === true}
                        onCheckedChange={() =>
                          handleSkillChange(skill.name, true)
                        }
                      />
                      <label
                        htmlFor={`skill-${skill.name}-yes`}
                        className="text-sm"
                      >
                        Sí
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`skill-${skill.name}-no`}
                        checked={skillAnswers[skill.name] === false}
                        onCheckedChange={() =>
                          handleSkillChange(skill.name, false)
                        }
                      />
                      <label
                        htmlFor={`skill-${skill.name}-no`}
                        className="text-sm"
                      >
                        No
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Previous Responsibilities */}
          <div className="mb-8 border-t px-28 pt-6">
            <h2 className="mb-2 text-lg font-medium">
              Responsabilidades anteriores
            </h2>
            <h3 className="mb-2 text-sm">
              ¿Has tenido estas responsabilidades? (Selecciona una opción para
              cada habilidad)
            </h3>
            <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {positionData.position_responsabilities.map((resp) => (
                <div key={resp} className="space-y-1">
                  <p className="mb-1 text-sm">{resp}</p>
                  <div className="flex gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`resp-${resp}-yes`}
                        checked={responsibilityAnswers[resp] === true}
                        onCheckedChange={() =>
                          handleResponsibilityChange(resp, true)
                        }
                      />
                      <label htmlFor={`resp-${resp}-yes`} className="text-sm">
                        Sí
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`resp-${resp}-no`}
                        checked={responsibilityAnswers[resp] === false}
                        onCheckedChange={() =>
                          handleResponsibilityChange(resp, false)
                        }
                      />
                      <label htmlFor={`resp-${resp}-no`} className="text-sm">
                        No
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Salary Expectation */}
          <div className="mb-8 border-t px-28 pt-6">
            <h2 className="mb-2 text-lg font-medium">Aspiración salarial</h2>
            <p className="mb-2 text-sm">
              ¿Cuál es tu aspiración salarial para este cargo?
            </p>
            <Input
              placeholder="Escribe aquí tu expectativa salarial"
              className="max-w-md"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
            />
          </div>

          {/* Form Buttons */}
          <div className="flex gap-4 border-t px-28 pt-6">
            <Button
              variant="ghost"
              className="hover: bg-secondary px-8 text-talent-green-500"
            >
              Cancelar
            </Button>
            <Button
              onClick={sendApplication}
              variant="talentGreen"
              disabled={!canSubmit}
            >
              Enviar formulario
            </Button>
          </div>
        </div>
      </div>
      <footer className="flex h-[60px] w-full items-center justify-center bg-talent-footer">
        <Text size="small" type="p" className="text-white">
          {footer.message}
        </Text>
      </footer>
    </div>
  );
};
