"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Dictionary } from "@/types/i18n";
import { FC, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DIAL_CODES } from "@/lib/data/countries";
import { PHASE_NAMES, PositionData } from "@/types";
import Image from "next/image";
import { Text } from "../Typography/Text";
import { DetailsSheet } from "../PositionDetailsPage/DetailsSheet";
import { useUpdateHiringProcessCustomFields } from "@/hooks/use-update-hiring-process-custom-fields";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import { useMoveCardToPhase } from "@/hooks/use-move-card-to-phase";
import { Loader2 } from "lucide-react";
import { CandidateStepper } from "../CandidateProgress/CandidateStepper";
import {
  calculateSalaryRangeScore,
  calculateSalaryScore,
  calculateScore,
  findPhaseByName,
} from "@/lib/utils";
import { usePositionById } from "@/hooks/use-position-by-id";
import LoadingSkeleton from "../PositionDetailsPage/Skeleton";
import { toast } from "@/hooks/use-toast";
import {
  CANDIDATE_EMAIL_FIELD_ID,
  CANDIDATE_PHONE_FIELD_ID,
  INITIAL_FILTER_SCORE_THRESHOLD,
} from "@/constants";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { CandidateSources, PipefyFieldValues } from "@/types/pipefy";
import { useUpdateFieldsValues } from "@/hooks/use-update-fields";
import { CurrentPhaseFormDialog } from "../CandidateProgress/CurrentPhaseFormDialog";
type ApplicationFormProps = {
  lang: Locale;
  dictionary: Dictionary;
  positionData: PositionData;
  companyName: string;
  vacancyName: string;
  token: string;
};
export const ApplicationForm: FC<Readonly<ApplicationFormProps>> = ({
  lang,
  dictionary,
  positionData,
  companyName,
  vacancyName,
  token,
}) => {
  const [selectedDialCode, setSelectedDialCode] = useState("+51");
  const { footer } = dictionary;
  const [expectedSalary, setExpectedSalary] = useState<string>("");
  const [candidateEmail, setCandidateEmail] = useState<string>("");
  const [candidatePhone, setCandidatePhone] = useState<string>("");
  const router = useRouter();
  const { card, isLoading: isLoadingCard } = usePipefyCard({
    cardId: positionData.hiring_card_id,
  });
  const fieldMap = PipefyBoardTransformer.mapFields(card?.fields || []);
  const candidateSource = fieldMap[PipefyFieldValues.CandidateSource];
  const linkedinSource = candidateSource === CandidateSources.LinkedIn;
  const { mutate: updateFieldsValues, isPending: isUpdatingFieldsValues } =
    useUpdateFieldsValues({
      onSuccess: () => {
        console.log("Fields updated");
      },
      onError: (error) => {
        console.error("Error updating fields values", error);
      },
    });

  const { data: position, isLoading: isPositionLoading } = usePositionById({
    id: positionData.position_id,
  });

  const { mutate: moveCardToPhase, isPending: isMovingCardToPhase } =
    useMoveCardToPhase({
      onSuccess: (data) => {
        console.log("Card moved to phase", data);
        toast({
          title: "Formulario enviado correctamente",
          description: "El formulario ha sido enviado correctamente",
        });
        router.push(`/${lang}/${companyName}/${vacancyName}?token=${token}`);
      },
      onError: (error) => {
        console.error("Error moving card to phase", error);
      },
    });

  const {
    mutate: updateHiringProcessCustomFields,
    isPending: isUpdatingHiringProcessCustomFields,
  } = useUpdateHiringProcessCustomFields({
    onSuccess: () => {
      const skillsScore = calculateScore(skillAnswers);
      const responsibilitiesScore = calculateScore(responsibilityAnswers);
      let salaryScore = 5;
      if (positionData.position_salary_range?.salary) {
        salaryScore = calculateSalaryScore(
          Number(expectedSalary),
          Number(position?.position_salary_range?.salary),
        );
      }
      if (positionData.position_salary_range?.salary_range) {
        salaryScore = calculateSalaryRangeScore(
          {
            min: Number(positionData.position_salary_range.salary_range.min),
            max: Number(positionData.position_salary_range.salary_range.max),
          },
          Number(expectedSalary),
        );
      }
      const overallScore =
        (skillsScore + responsibilitiesScore + salaryScore) / 3;

      const canAdvance = overallScore >= INITIAL_FILTER_SCORE_THRESHOLD;
      const nextPhase = card?.pipe.phases.find((phase) =>
        canAdvance
          ? phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT
          : phase.name === PHASE_NAMES.INITIAL_FILTER,
      );
      console.log(
        "%c[Debug] skillAnswers",
        "background-color: teal; font-size: 20px; color: white",
        {
          nextPhase,
          responsibilityAnswers,
          skillAnswers,
          expectedSalary,
          skillsScore,
          responsibilitiesScore,
          salaryScore,
          overallScore,
        },
      );
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
    const offerSentPhase = card?.pipe.phases.find(
      (phase) => phase.name === PHASE_NAMES.OFFER_SENT,
    );
    if (!offerSentPhase) return;
    console.log(
      "%c[Debug] offerSentPhase",
      "background-color: teal; font-size: 20px; color: white",
      offerSentPhase,
    );
    updateHiringProcessCustomFields({
      id: positionData.hiring_id,
      phases: {
        [offerSentPhase.id]: {
          phase_id: offerSentPhase.id,
          custom_fields: customFields,
        },
      },
    });
  };

  console.log(
    "%c[Debug] positionData",
    "background-color: teal; font-size: 20px; color: white",
    { positionData, card, position },
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

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const sendApplication = () => {
    const values = [];
    if (candidateEmail) {
      values.push({
        fieldId: CANDIDATE_EMAIL_FIELD_ID,
        value: candidateEmail,
      });
    }
    if (candidatePhone) {
      values.push({
        fieldId: CANDIDATE_PHONE_FIELD_ID,
        value: candidatePhone,
      });
    }
    updateFieldsValues({
      nodeId: positionData.hiring_card_id,
      values,
    });
    handleUpdateHiringProcessCustomFields({
      responsibilities: responsibilityAnswers,
      skills: skillAnswers,
      expected_salary: expectedSalary,
      accepted_terms: acceptedTerms,
    });
  };

  if (isLoadingCard || !card || isPositionLoading || !position)
    return <LoadingSkeleton />;
  const currentPhase = findPhaseByName(
    // PHASE_NAMES.FINALISTS,
    card.current_phase.name,
    position.position_flow,
  );
  // Compute if all checkboxes are selected (no undefined values)
  const allSkillsAnswered = positionData.position_skills.every(
    (skill) => typeof skillAnswers[skill.name] === "boolean",
  );
  const allResponsibilitiesAnswered =
    positionData.position_responsabilities.every(
      (resp) => typeof responsibilityAnswers[resp] === "boolean",
    );

  const phoneCompleted = selectedDialCode && candidatePhone;
  const emailCompleted = !linkedinSource ? true : candidateEmail;
  const canSubmit =
    allSkillsAnswered &&
    allResponsibilitiesAnswered &&
    expectedSalary &&
    phoneCompleted &&
    emailCompleted &&
    acceptedTerms;

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
        </nav>
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
          <div className="mx-auto flex w-full flex-col bg-white px-4 py-8 text-center">
            <CandidateStepper
              currentPhase={currentPhase}
              positionFlow={position.position_flow}
            />
          </div>
          <div className="mb-12 h-[1px] w-full bg-gray-200"></div>

          {/* Welcome Section */}
          <div className="mb-8 px-4 md:px-28">
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
          <div className="mb-8 px-4 md:px-28">
            <h2 className="mb-2 text-lg font-medium">Contacto</h2>
            {!linkedinSource && (
              <p className="mb-2 text-sm">Correo electrónico.</p>
            )}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {!linkedinSource && (
                <Input
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="Correo@prueba.com"
                />
              )}
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
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                  placeholder="300 123 456"
                  className="flex-1 rounded-l-none"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8 px-4 md:px-28">
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
                        className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
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
                        className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
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
          <div className="mb-8 border-t px-4 pt-6 md:px-28">
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
                        className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
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
                        className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
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
          <div className="mb-8 border-t px-4 pt-6 md:px-28">
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

          {position.position_education &&
            position.position_education.length > 0 && (
              <div className="mb-8 border-t px-4 pt-6 md:px-28">
                <h2 className="mb-2 text-lg font-medium">
                  Formación académica esperada para este cargo
                </h2>
                <ul className="mb-2 list-disc space-y-2">
                  {position.position_education?.map((item, idx) => (
                    <li key={idx} className="text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mb-2 text-sm">
                  Por favor, haz clic en el botón “Adjuntar” y comparte los
                  documentos que consideres relevantes para validar tu
                  experiencia y formación académ
                </p>
                <CurrentPhaseFormDialog
                  cardId={position.hiring_card_id}
                  label="Adjuntar documentos"
                />
              </div>
            )}

          {/* Form Buttons */}
          <div className="flex flex-col gap-2 border-t px-4 pt-6 md:px-28">
            <div className="mb-2 flex items-center space-x-2">
              <Checkbox
                id="accept-terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) => setAcceptedTerms(!!checked)}
                className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
              />
              <label htmlFor="accept-terms" className="select-none text-sm">
                Acepto los{" "}
                <a
                  href="/terms"
                  target="_blank"
                  className="font-bold text-talent-green-700 underline"
                >
                  términos y condiciones
                </a>
              </label>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                className="hover: bg-secondary px-8 text-talent-green-500"
              >
                Cancelar
              </Button>
              <Button
                onClick={sendApplication}
                variant="talentGreen"
                disabled={
                  !canSubmit ||
                  isUpdatingHiringProcessCustomFields ||
                  isMovingCardToPhase ||
                  isLoadingCard ||
                  isUpdatingFieldsValues
                }
              >
                Enviar formulario
                {(isUpdatingFieldsValues ||
                  isUpdatingHiringProcessCustomFields ||
                  isMovingCardToPhase ||
                  isLoadingCard) && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
              </Button>
            </div>
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
