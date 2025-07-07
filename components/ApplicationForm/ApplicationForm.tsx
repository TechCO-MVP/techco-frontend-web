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
import { CalendarIcon, Loader2 } from "lucide-react";
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
  CANDIDATE_BIRTHDAY_FIELD_ID,
  CANDIDATE_DNI_FIELD_ID,
  CANDIDATE_EMAIL_FIELD_ID,
  CANDIDATE_FATHERS_FULLNAME_FIELD_ID,
  CANDIDATE_MOTHERS_FULLNAME_FIELD_ID,
  CANDIDATE_PHONE_FIELD_ID,
  INITIAL_FILTER_SCORE_THRESHOLD,
  REJECTED_PHASE_NAME,
} from "@/constants";
import { useRouter } from "next/navigation";
import { Locale } from "@/i18n-config";
import { PipefyBoardTransformer } from "@/lib/pipefy/board-transformer";
import { CandidateSources, PipefyFieldValues } from "@/types/pipefy";
import { useUpdateFieldsValues } from "@/hooks/use-update-fields";
import { AttachFileDialog } from "../CandidateProgress/AttachFileDialog";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { GLORIA_BUSINESSES_ID } from "@/constants";
import { DayPicker, getDefaultClassNames } from "react-day-picker";

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
  const [hasSeniority, setHasSeniority] = useState<boolean>();
  const [candidateBirthday, setCandidateBirthday] = useState<Date | undefined>(
    undefined,
  );
  const [calendarOpen, setCalendarOpen] = useState(false);

  const [candidateDni, setCandidateDni] = useState<string>("");
  const [candidateFathersFullname, setCandidateFathersFullname] =
    useState<string>("");
  const [candidateMothersFullname, setCandidateMothersFullname] =
    useState<string>("");
  const router = useRouter();
  const { card, isLoading: isLoadingCard } = usePipefyCard({
    cardId: positionData.hiring_card_id,
  });
  const fieldMap = PipefyBoardTransformer.mapFields(card?.fields || []);
  const candidateSource = fieldMap[PipefyFieldValues.CandidateSource];
  const linkedinSource = candidateSource === CandidateSources.LinkedIn;
  const isGloriaBusiness = GLORIA_BUSINESSES_ID.includes(
    positionData.business_id,
  );
  const defaultClassNames = getDefaultClassNames();

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

  const discardProcess = () => {
    const rejectedPhase = card?.pipe.phases.find(
      (phase) => phase.name === REJECTED_PHASE_NAME,
    );
    console.log(
      "%c[Debug] Discard process",
      "background-color: teal; font-size: 20px; color: white",
      { rejectedPhase },
    );
    if (!rejectedPhase) return;
    moveCardToPhase({
      cardId: positionData.hiring_card_id,
      destinationPhaseId: rejectedPhase.id,
    });
  };

  const {
    mutate: updateHiringProcessCustomFields,
    isPending: isUpdatingHiringProcessCustomFields,
  } = useUpdateHiringProcessCustomFields({
    onSuccess: () => {
      const skillsScore = calculateScore(skillAnswers);
      const responsibilitiesScore = calculateScore(responsibilityAnswers);
      if (hasSeniority === false) {
        return discardProcess();
      }
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
      const seniorityScore = hasSeniority ? 5 : 0;
      const overallScore =
        (skillsScore + responsibilitiesScore + salaryScore + seniorityScore) /
        4;

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
    if (isGloriaBusiness) {
      if (candidateBirthday) {
        values.push({
          fieldId: CANDIDATE_BIRTHDAY_FIELD_ID,
          value: format(candidateBirthday, "yyyy-MM-dd"),
        });
      }
      if (candidateDni) {
        values.push({
          fieldId: CANDIDATE_DNI_FIELD_ID,
          value: candidateDni,
        });
      }
      if (candidateFathersFullname) {
        values.push({
          fieldId: CANDIDATE_FATHERS_FULLNAME_FIELD_ID,
          value: candidateFathersFullname,
        });
      }
      if (candidateMothersFullname) {
        values.push({
          fieldId: CANDIDATE_MOTHERS_FULLNAME_FIELD_ID,
          value: candidateMothersFullname,
        });
      }
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
      has_seniority: hasSeniority,
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
  const birthdayCompleted = isGloriaBusiness ? candidateBirthday : true;
  const dniCompleted = isGloriaBusiness ? candidateDni : true;
  const fathersFullnameCompleted = isGloriaBusiness
    ? candidateFathersFullname
    : true;
  const mothersFullnameCompleted = isGloriaBusiness
    ? candidateMothersFullname
    : true;
  const canSubmit =
    allSkillsAnswered &&
    allResponsibilitiesAnswered &&
    expectedSalary &&
    phoneCompleted &&
    emailCompleted &&
    birthdayCompleted &&
    dniCompleted &&
    fathersFullnameCompleted &&
    mothersFullnameCompleted &&
    acceptedTerms;

  return (
    <div className="relative flex h-full min-h-screen flex-col items-center justify-center bg-gray-50">
      <header className="w-full px-20 py-8">
        <nav className="flex flex-col items-center justify-between md:flex-row">
          <Image
            priority
            width={152}
            height={36}
            src="/assets/talent_connect.svg"
            alt="TechCo"
            className="hidden md:block"
          />
          <ul className="mt-[250px] flex justify-end space-x-4 md:mt-0">
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
          <div className="mb-8 border-t px-4 pt-6 md:px-28">
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
          {isGloriaBusiness && (
            <div className="mb-8 border-t px-4 pt-6 md:px-28">
              <h2 className="mb-2 text-lg font-medium">Datos personales</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm" htmlFor="candidate-birthday">
                    Fecha de nacimiento
                  </Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={
                          "relative w-full justify-start pl-10 text-left font-normal" +
                          (!candidateBirthday ? " text-muted-foreground" : "")
                        }
                        type="button"
                      >
                        <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        {candidateBirthday
                          ? format(candidateBirthday, "PPP", { locale: es })
                          : "Selecciona una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                      <DayPicker
                        animate
                        mode="single"
                        captionLayout="dropdown"
                        selected={candidateBirthday}
                        onSelect={(date) => {
                          setCandidateBirthday(date);
                          setCalendarOpen(false);
                        }}
                        locale={es}
                        classNames={{
                          today: `border-talent-green-500`,
                          selected: `bg-talent-green-500 border-talent-green-500 text-white rounded-lg`,
                          chevron: `${defaultClassNames.chevron} fill-talent-green-500`,
                          root: `${defaultClassNames.root} capitalize`,
                          months_dropdown: `${defaultClassNames.months_dropdown} capitalize`,
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex flex-col gap-2">
                  <Label className="text-sm" htmlFor="candidate-dni">
                    DNI
                  </Label>
                  <Input
                    id="candidate-dni"
                    value={candidateDni}
                    onChange={(e) => setCandidateDni(e.target.value)}
                    placeholder="12345678"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    className="text-sm"
                    htmlFor="candidate-fathers-fullname"
                  >
                    Nombre completo del padre
                  </Label>
                  <Input
                    id="candidate-fathers-fullname"
                    value={candidateFathersFullname}
                    onChange={(e) =>
                      setCandidateFathersFullname(e.target.value)
                    }
                    placeholder="Juan Pérez"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label
                    className="text-sm"
                    htmlFor="candidate-mothers-fullname"
                  >
                    Nombre completo de la madre
                  </Label>
                  <Input
                    id="candidate-mothers-fullname"
                    value={candidateMothersFullname}
                    onChange={(e) =>
                      setCandidateMothersFullname(e.target.value)
                    }
                    placeholder="María López"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 border-t px-4 pt-6 md:px-28">
            <h2 className="mb-2 text-lg font-medium">Experiencia laboral</h2>
            <h3 className="mb-2 text-sm">
              Queremos que nos cuentes con total sinceridad si cuentas con la
              siguiente experiencia, tal como se describe a continuación. Esta
              información será verificada con los documentos que adjuntes. Si no
              cumples con este requisito, lamentablemente no podremos tener en
              cuenta tu postulación.
            </h3>
            <span>{position.position_seniority}</span>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
                  id={`seniority-yes`}
                  checked={hasSeniority === true}
                  onCheckedChange={() => setHasSeniority(true)}
                />
                <label htmlFor={`seniority-yes`} className="text-sm">
                  Sí
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="border-talent-green-500 data-[state=checked]:bg-talent-green-500"
                  id={`seniority-no`}
                  checked={hasSeniority === false}
                  onCheckedChange={() => setHasSeniority(false)}
                />
                <label htmlFor={`seniority-no`} className="text-sm">
                  No
                </label>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="mb-8 border-t px-4 pt-6 md:px-28">
            <h2 className="mb-2 text-lg font-medium">Habilidades</h2>
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
              onChange={(e) => {
                const value = e.target.value
                  .replace(/[^0-9.]/g, "")
                  .replace(/(\..*)\./g, "$1");
                setExpectedSalary(value);
              }}
            />
          </div>

          <div className="mb-8 border-t px-4 pt-6 md:px-28">
            <h2 className="mb-2 text-lg font-medium">Documentos</h2>
            <p className="mb-4 text-sm font-bold">
              ⚠️ Recuerda: tu postulación solo será válida si adjuntas tu hoja
              de vida y los documentos que certifiquen tu experiencia y
              habilidades para el cargo.
            </p>
            <p className="mb-4 text-sm">
              Formación académica esperada para este cargo:
            </p>
            <ul className="mb-4 space-y-2">
              {position.position_education?.map((education, index) => (
                <li key={index} className="flex items-start text-sm">
                  <span className="mr-3 mt-1">•</span>
                  <span className="leading-relaxed">{education}</span>
                </li>
              ))}
            </ul>

            <AttachFileDialog
              organizationId={card.pipe.organizationId}
              cardId={positionData.hiring_card_id}
            />
          </div>

          {/* Form Buttons */}
          <div className="flex flex-col gap-2 border-t px-4 pt-6 md:px-28">
            <div className="mb-4">
              <p className="text-sm">
                Tendrás un enlace único para hacer seguimiento a todo tu
                proceso. Cada cambio de estado se notificará a través de tu
                correo electrónico, así que asegúrate de registrar uno que
                revises con frecuencia.
              </p>
            </div>
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
