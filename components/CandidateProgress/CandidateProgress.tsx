"use client";
import {
  Assessment,
  AssistantName,
  PHASE_NAMES,
  PositionConfigurationPhaseTypes,
  PositionData,
} from "@/types";
import type { TechnicalAssessment as TechnicalAssessmentType } from "@/types";

import { Dictionary } from "@/types/i18n";
import { FC, useState } from "react";
import { PositionDetailsPage } from "../PositionDetailsPage/PositionDetailsPage";
import { usePipefyCard } from "@/hooks/use-pipefy-card";
import LoadingSkeleton from "../PositionDetailsPage/Skeleton";
import { usePositionById } from "@/hooks/use-position-by-id";
import { findPhaseByName, sanitizeHtml } from "@/lib/utils";
import { CandidateStepper } from "./CandidateStepper";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";

import {
  CULTURAL_FIT_FIELD_ID,
  STATEMENT_BUTTON_TEXT,
  TECHNICAL_TEST_FIELD_ID,
} from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import Image from "next/image";
import { DetailsSheet } from "../PositionDetailsPage/DetailsSheet";
import { Button } from "../ui/button";
import { AbandonProcessDialog } from "./AbandonProcessDialog";
import { CulturalAssessment } from "./CulturalAssessment";
import { TechnicalAssessment } from "./TechnicalAssessment";
import { CurrentPhaseFormDialog } from "./CurrentPhaseFormDialog";

interface CandidateProgressProps {
  positionData: PositionData;
  dictionary: Dictionary;
  company_name: string;
  vacancy_name: string;
  token: string;
}
export const CandidateProgress: FC<CandidateProgressProps> = ({
  positionData,
  dictionary,
  company_name,
  vacancy_name,
  token,
}) => {
  const [shouldRefetch, setShouldRefetch] = useState(true);
  const { hiring_card_id } = positionData;
  const { card, isLoading } = usePipefyCard({
    cardId: hiring_card_id,
    options: {
      refetchInterval: 10000,
      enabled: shouldRefetch,
    },
  });

  const { data: position, isLoading: isPositionLoading } = usePositionById({
    id: positionData.position_id,
  });

  if (isLoading || !card || isPositionLoading || !position)
    return <LoadingSkeleton />;

  const currentPhase = findPhaseByName(
    // PHASE_NAMES.FINALISTS,
    card.current_phase.name,
    position.position_flow,
  );
  console.log(
    "%c[Debug] currentPhase",
    "background-color: teal; font-size: 20px; color: white",
    {
      position,
      card,
      currentPhase,
      positionData,
    },
  );

  const renderSoftSkillAssessment = () => {
    const assessment = position.position_assessments.find(
      (assessment) =>
        assessment.type === PositionConfigurationPhaseTypes.SOFT_SKILLS,
    )?.data as Assessment;
    if (!assessment) return null;
    return (
      <CulturalAssessment
        position={position}
        card={card}
        organizationId={card.pipe.organizationId}
        hiringProcessId={positionData.hiring_id}
        cardId={hiring_card_id}
        fieldId={
          card.current_phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT
            ? CULTURAL_FIT_FIELD_ID
            : TECHNICAL_TEST_FIELD_ID
        }
        assistantName={
          card.current_phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT
            ? AssistantName.CULTURAL_FIT_ASSESSMENT
            : AssistantName.TECHNICAL_ASSESSMENT
        }
        softSkills={assessment.soft_skills}
      />
    );
  };

  const renderTechnicalAssessment = () => {
    const assessment = position.position_assessments.find(
      (assessment) =>
        assessment.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
    )?.data as TechnicalAssessmentType;
    if (!assessment) return null;
    return (
      <TechnicalAssessment
        card={card}
        assessment={assessment}
        position={position}
        assistantName={
          card.current_phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT
            ? AssistantName.CULTURAL_FIT_ASSESSMENT
            : AssistantName.TECHNICAL_ASSESSMENT
        }
        organizationId={card.pipe.organizationId}
        hiringProcessId={positionData.hiring_id}
        fieldId={
          card.current_phase.name === PHASE_NAMES.CULTURAL_FIT_ASSESSMENT
            ? CULTURAL_FIT_FIELD_ID
            : TECHNICAL_TEST_FIELD_ID
        }
        cardId={hiring_card_id}
      />
    );
  };

  const renderPhaseContent = () => {
    return (
      <div className="relative flex h-full min-h-screen items-center bg-gray-50">
        <div
          className="min-h-100vh flex h-full min-h-screen w-full flex-col bg-gray-50"
          style={{
            backgroundImage: "url('/assets/background.jpeg')",
            backgroundBlendMode: "lighten",
            backgroundColor: "rgba(255,255,255,0.8)",
          }}
        >
          <header className="w-full px-20 py-8">
            <nav className="flex items-center justify-between">
              <Image
                priority
                width={152}
                height={36}
                src="/assets/talent_connect.svg"
                alt="TechCo"
              />
              <ul className="hidden justify-end space-x-4 md:flex">
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
          <div className="mx-auto flex w-full max-w-[1280px] flex-col bg-white px-4 py-8 text-center">
            <CandidateStepper
              currentPhase={currentPhase}
              positionFlow={position.position_flow}
            />

            <div className="mx-auto mt-[120px] max-w-2xl px-4 md:mt-0 md:px-0">
              <div className="mx-auto mb-8 max-w-2xl">
                <div className="mb-4 flex justify-end md:hidden">
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
                </div>
                {currentPhase?.candidateData?.sections.map((section) => {
                  return (
                    <div
                      key={section.title}
                      className="mb-4 flex flex-col items-start gap-2"
                    >
                      <Heading
                        className="mb-2 text-left text-5xl font-bold text-talent-green-500"
                        level={2}
                      >
                        {section.title}
                      </Heading>
                      <Text className="text-left text-xl font-bold text-foreground">
                        {section.subtitle}
                      </Text>
                      <Text className="text-left text-sm text-[#090909]">
                        {section.description}
                      </Text>
                      {(card.current_phase.name ===
                        PHASE_NAMES.FIRST_INTERVIEW_SCHEDULED ||
                        card.current_phase.name ===
                          PHASE_NAMES.FINAL_INTERVIEW_SCHEDULED ||
                        (section.button_text &&
                          section.button_text === STATEMENT_BUTTON_TEXT)) && (
                        <>
                          {card.current_phase.fields.map((field, index) => {
                            return field.type === "statement" ? (
                              <div
                                className="flex w-full flex-col items-center gap-2 text-sm text-[#090909]"
                                key={index}
                                dangerouslySetInnerHTML={{
                                  __html: sanitizeHtml(field.description),
                                }}
                              ></div>
                            ) : null;
                          })}
                        </>
                      )}
                      <div className="flex gap-2">
                        <AbandonProcessDialog
                          setShouldRefetch={setShouldRefetch}
                          dictionary={dictionary}
                          cardId={positionData.hiring_card_id}
                        />
                        {section.button_text &&
                          section.button_text !== STATEMENT_BUTTON_TEXT &&
                          card.current_phase.name !==
                            PHASE_NAMES.CULTURAL_FIT_ASSESSMENT && (
                            <CurrentPhaseFormDialog
                              cardId={positionData.hiring_card_id}
                              label={section.button_text}
                            />
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {card.current_phase.name ===
                PHASE_NAMES.CULTURAL_FIT_ASSESSMENT && (
                <div className="mb-4 flex items-center justify-between">
                  <Accordion
                    type="single"
                    collapsible
                    className="mx-auto w-full max-w-2xl"
                  >
                    <AccordionItem value="instructions">
                      <AccordionTrigger className="bg-[#F5F5F5] px-2 font-bold">
                        Instrucciones
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance py-4 text-left">
                        <div className="cursor-text leading-relaxed text-[#090909]">
                          Formato del archivo
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              El documento debe ser entregado en formato PDF.
                            </li>
                            <li>No debe tener contraseña ni estar protegido</li>
                          </ul>
                          <p>Plazo de entrega</p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Tienes un plazo de 2 días calendario para enviar
                              la prueba resuelta, contados a partir de la fecha
                              de recepción de este mensaje.
                            </li>
                            <li>
                              Asegúrate de enviar el archivo antes del
                              vencimiento del plazo.
                            </li>
                          </ul>
                          <p>
                            Contenido del documento:{" "}
                            <span className="font-semibold">
                              En el PDF solo debes incluir lo siguiente:
                            </span>
                          </p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Tu nombre completo como presentante del
                              assessment.
                            </li>
                            <li>
                              El título exacto de cada pregunta, tal como
                              aparece en la prueba.
                            </li>
                            <li>
                              La respuesta correspondiente justo debajo del
                              título de cada pregunta.
                            </li>
                          </ul>
                          <p>Formato del contenido</p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Por favor, no modifiques el enunciado de las
                              preguntas.
                            </li>
                            <li>
                              Asegúrate de que cada respuesta esté debidamente
                              identificada y organizada según su pregunta
                              correspondiente.
                            </li>
                            <li>
                              Si incluyes código, puede ir en formato texto o
                              capturas, pero asegúrate de que sea legible.
                            </li>
                          </ul>
                          <p>Recomendaciones adicionales</p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Revisa la ortografía y redacción antes de enviar
                              el documento.
                            </li>
                            <li>
                              Si usaste recursos externos o bibliografía, puedes
                              mencionarlos al final del documento.
                            </li>
                            <li>
                              Verifica que el archivo se abra correctamente
                              antes de enviarlo
                            </li>
                            <li>
                              El nombre del archivo puede seguir este formato:
                              Assessment_cultural_NombreApellido.pdf.
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="assessment" className="border-0">
                      <AccordionTrigger className="bg-[#F5F5F5] px-2 font-bold">
                        Prueba
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        {renderSoftSkillAssessment()}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}

              {card.current_phase.name === PHASE_NAMES.TECHNICAL_ASSESSMENT && (
                <div className="mb-4 flex items-center justify-between">
                  <Accordion
                    type="single"
                    collapsible
                    className="mx-auto w-full max-w-2xl"
                  >
                    <AccordionItem value="instructions" className="border-0">
                      <AccordionTrigger className="bg-[#F5F5F5] px-6 py-4 font-bold">
                        Instrucciones
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance py-4 text-left">
                        <div className="cursor-text leading-relaxed text-[#090909]">
                          Formato del archivo
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              El documento debe ser entregado en formato PDF.
                            </li>
                            <li>No debe tener contraseña ni estar protegido</li>
                          </ul>
                          <p>Plazo de entrega</p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Tienes un plazo de 2 días calendario para enviar
                              la prueba resuelta, contados a partir de la fecha
                              de recepción de este mensaje.
                            </li>
                            <li>
                              Asegúrate de enviar el archivo antes del
                              vencimiento del plazo.
                            </li>
                          </ul>
                          <p>
                            Contenido del documento:{" "}
                            <span className="font-semibold">
                              En el PDF solo debes incluir lo siguiente:
                            </span>
                          </p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Tu nombre completo como presentante del
                              assessment.
                            </li>
                            <li>
                              El título exacto de cada pregunta, tal como
                              aparece en la prueba.
                            </li>
                            <li>
                              La respuesta correspondiente justo debajo del
                              título de cada pregunta.
                            </li>
                          </ul>
                          <p>Formato del contenido</p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Por favor, no modifiques el enunciado de las
                              preguntas.
                            </li>
                            <li>
                              Asegúrate de que cada respuesta esté debidamente
                              identificada y organizada según su pregunta
                              correspondiente.
                            </li>
                            <li>
                              Si incluyes código, puede ir en formato texto o
                              capturas, pero asegúrate de que sea legible.
                            </li>
                          </ul>
                          <p>Recomendaciones adicionales</p>
                          <ul className="mb-2 list-disc pl-6">
                            <li>
                              Revisa la ortografía y redacción antes de enviar
                              el documento.
                            </li>
                            <li>
                              Si usaste recursos externos o bibliografía, puedes
                              mencionarlos al final del documento.
                            </li>
                            <li>
                              Verifica que el archivo se abra correctamente
                              antes de enviarlo
                            </li>
                            <li>
                              El nombre del archivo puede seguir este formato:
                              Assessment_cultural_NombreApellido.pdf.
                            </li>
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="assessment" className="border-0">
                      <AccordionTrigger className="bg-[#F5F5F5] px-6 py-4 font-bold">
                        Prueba
                      </AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-4 text-balance">
                        {renderTechnicalAssessment()}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  if (
    card.current_phase.name === PHASE_NAMES.SUGGESTED_CANDIDATES ||
    card.current_phase.name === PHASE_NAMES.OFFER_SENT
  ) {
    return (
      <PositionDetailsPage
        positionData={positionData}
        dictionary={dictionary}
        company_name={company_name}
        vacancy_name={vacancy_name}
        token={token}
      />
    );
  }
  return renderPhaseContent();
};
