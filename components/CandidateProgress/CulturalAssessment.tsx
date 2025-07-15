"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Textarea } from "@/components/ui/textarea";
import {
  Assessment,
  AssessmentSoftSkill,
  AssistantName,
  PositionConfigurationPhaseTypes,
  PositionData,
  TechnicalAssessment,
} from "@/types";
import { CulturalAssessmentPdf } from "./CulturalAssessmentPdf";
import { pdf } from "@react-pdf/renderer";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { useUploadPdf } from "@/hooks/use-upload-pdf";
import { PipefyCardResponse, PipefyFieldValues } from "@/types/pipefy";
import { UPLOAD_FILE_PROMPT } from "@/constants";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePresignedUrl } from "@/hooks/use-presigned-url";
import { useUploadFile } from "@/hooks/use-file-upload";
import * as actions from "@/actions";

export const CulturalAssessment = ({
  position,
  organizationId,
  cardId,
  fieldId,
  hiringProcessId,
  assistantName,
  softSkills,
  card,
}: {
  position: PositionData;
  card: PipefyCardResponse["card"];
  nextPhase?: {
    id: string;
    name: string;
  };
  organizationId: string;
  cardId: string;
  fieldId: string;
  hiringProcessId: string;
  assistantName: AssistantName;
  softSkills: AssessmentSoftSkill[];
}) => {
  const [responses, setResponses] = useState<
    Record<string, Record<string, string>>
  >({});
  const [presignedUrl, setPresignedUrl] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const { uploadFile } = useUploadFile();
  const { mutate: getPresignedUrl, isPending: isGetPresignedUrlPending } =
    usePresignedUrl({
      onSuccess: (data) => {
        console.log("usePresignedUrl success", data);
        setPresignedUrl(data.createPresignedUrl.url);
      },
      onError: (data) => {
        console.log("usePresignedUrl error", data);
      },
    });

  // Check if cultural assessment was already uploaded
  const existingAssessment = card.attachments.find(
    (attachment) =>
      attachment.field.index_name ===
      PipefyFieldValues.CulturalAssessmentResult,
  );

  useEffect(() => {
    if (existingAssessment) {
      setIsCompleted(true);
    }
  }, [existingAssessment]);

  const buildPrompt = (assistantName: AssistantName) => {
    try {
      const culturalFitAssessment = position.position_entity.assessments.find(
        (assessment) =>
          assessment.type === PositionConfigurationPhaseTypes.SOFT_SKILLS,
      )?.data as Assessment;
      const technicalAssessment = position.position_entity.assessments.find(
        (assessment) =>
          assessment.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
      )?.data as TechnicalAssessment;

      // const totalSoftSkills = culturalFitAssessment?.soft_skills.length || 0;
      // const totalDimensions = totalSoftSkills * 3;
      if (assistantName === AssistantName.CULTURAL_FIT_ASSESSMENT) {
        if (!culturalFitAssessment) return UPLOAD_FILE_PROMPT;
        return `<rol>
          Actúa como un experto en la calificación de pruebas de comportamientos esperados a candidatos que participan en procesos de selección. 
          </rol>

          <objetivo>
          Realizar la evaluación de las *15 respuestas del candidato* asociadas a *5 comportamientos* que están en el documento *cultural-assessment.pdf, ubicado en el tool **File search* de tu configuración, basándote en tus *System instructions y la información de este PROMPT*
          </objetivo>

          <contexto>
          El documento que vas a evaluar *contiene la siguiente información:* 
          *Cinco comportamientos:*
          1. “Asegura responsabilidad”
          2. “Enfoque en el cliente”
          3. “Cultiva la innovación”
          4. “Desarrolla talento”
          5. “Maneja la complejidad”
          *Cada uno de los 5 comportamientos, tiene asociadas tres preguntas:*
          1. Pregunta situaciones
          2. Pregunta experiencial 
          3. Pregunta reflexiva.
          Cada pregunta, tiene asociada una respuesta del candidato. Es decir que en total, este documento contiene *15 respuestas del candidato que debes evaluar*. 
          </contexto>

          <proceso>
          Evalúa el documento realizando el siguiente proceso:

          Paso 1:
          *Evalúa las 3 respuestas del candidato asociadas al comportamiento “Asegura responsabilidad” que están en el documento:* 
          - Respuesta a la pregunta Situacional, 
          - Respuesta a la pregunta experiencial  
          - Respuesta a la pregunta reflexiva
          </proceso>

          Paso 2:
          Una vez hayas terminado el paso 1, *Evalúa las 3 respuestas del candidato asociadas al comportamiento “Enfoque en el cliente” que están en el documento:*
          - Respuesta a la pregunta Situacional, 
          - Respuesta a la pregunta experiencial  
          - Respuesta a la pregunta reflexiva.

          Paso 3:
          Una vez hayas terminado el paso 2, *Evalúa las 3 respuestas del candidato asociadas al comportamiento “Cultiva la innovación” que están en el documento:*
          - Respuesta a la pregunta Situacional, 
          - Respuesta a la pregunta experiencial  
          - Respuesta a la pregunta reflexiva.

          Paso 4.
          Una vez hayas terminado el paso 3, *Evalúa las 3 respuestas del candidato asociadas al comportamiento “Desarrolla talento” que están en el documento:*
          - Respuesta a la pregunta Situacional, 
          - Respuesta a la pregunta experiencial  
          - Respuesta a la pregunta reflexiva.

          Paso 5:
          Una vez hayas terminado el paso 4, *Evalúa las 3 respuestas del candidato asociadas al comportamiento “Maneja la complejidad” que están en el documento:*
          - Respuesta a la pregunta Situacional, 
          - Respuesta a la pregunta experiencial  
          - Respuesta a la pregunta reflexiva.

          Paso 6:
          Una vez hayas terminado el paso 5, *realiza un feedback general de todas las respuestas del candidato*

          <reglas_obligatorias>
          1. Debes responder en el formato *Json Schema* configurado en tu *Response format*.
          2. La única información que vas a generar, será la calificación y la justificación de tu calificación. El resto de la información que vas a completar en el json schema, debe ser exactamente igual a como está en el documento "cultural-assessment.pdf”.
          3. *Para calificar objetivamente, debes tener en cuenta el seniority del candidato* que es *mínimo 3 años de experiencia en el rol Key Account Manager en el sector de Consumo Masivo.*
          4. *Adopta una postura crítica y profesional. Estás evaluando la idoneidad de un candidato para un cargo específico. Considera esta prueba como una instancia formal para **valorar sus competencias, razonamiento y capacidad* para generar valor en el rol. Sé riguroso y objetivo en tu análisis.
          5. **Es obligatorio calificar las 15 preguntas que están en el documento "cultural-assessment.pdf".
          </reglas_obligatorias>`;
      }
      if (assistantName === AssistantName.TECHNICAL_ASSESSMENT) {
        if (!technicalAssessment) return UPLOAD_FILE_PROMPT;
        return `Descripcion de la empresa ${position.business_description}.
      Descripcion de la posicion ${position.position_entity.description}.
      Tiene personas a cargo: ${culturalFitAssessment.is_lead_position ? "Si" : "No"}.
      Autonomia: ${culturalFitAssessment.how_much_autonomy}.
      Principales retos: ${culturalFitAssessment.challenges_of_the_position}.
      Objetivo del assessment: ${technicalAssessment.assesment_goal}.
      Mision del assessment: ${technicalAssessment.your_mission}.
      Retos del assessment: ${technicalAssessment.challenge}.
      ${UPLOAD_FILE_PROMPT}
     `;
      }
      return UPLOAD_FILE_PROMPT;
    } catch (error) {
      console.error(error);
      return UPLOAD_FILE_PROMPT;
    }
  };

  const handleResponseChange = (
    skillName: string,
    dimensionName: string,
    value: string,
  ) => {
    setResponses((prev) => ({
      ...prev,
      [skillName]: {
        ...(prev[skillName] || {}),
        [dimensionName]: value,
      },
    }));
  };
  const { mutate: uploadPdf, isPending: isUploadingPdf } = useUploadPdf({
    onSuccess: async (data) => {
      setIsCompleted(true);
      console.log("uploadPdf success", data);
      console.log("getting presigned url");
      getPresignedUrl({
        organizationId,
        fileName: "cultural-assessment.pdf",
      });
      toast({
        title: "¡Recibimos tu prueba! ",
        description: "Te contamos pronto qué sigue.",
      });
      setResponses({});
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const generateAssessmentPdfFile = async () => {
    console.log("generating pdf");
    const blob = await pdf(
      <CulturalAssessmentPdf softSkills={softSkills} responses={responses} />,
    ).toBlob();
    // download the file
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "cultural-assessment.pdf";
    // a.click();
    // URL.revokeObjectURL(url);

    const file = new File([blob], "cultural-assessment.pdf", {
      type: "application/pdf",
    });
    if (!file) return;
    setSelectedFile(file);
    const prompt = buildPrompt(assistantName);
    console.log("uploading pdf to serverless");
    uploadPdf({
      file,
      hiringProcessId,
      assistantName,
      message: prompt,
    });
  };

  const uploadFileToPipefy = async () => {
    try {
      console.log("uploading file to pipefy");
      if (!selectedFile) return;
      setIsUploadingFile(true);
      await uploadFile(presignedUrl, selectedFile, selectedFile.type);
      const formData = new FormData();
      const filePath = new URL(presignedUrl).pathname.slice(1);
      formData.append("type", "attachment");
      formData.append("field_id", fieldId);
      formData.append("card_id", cardId);
      formData.append(fieldId, filePath);
      await actions.updateField(formData);
      setIsUploadingFile(false);
      setSelectedFile(null);
      setPresignedUrl("");
    } catch (error) {
      console.error(error);
      setIsUploadingFile(false);
    }
  };

  useEffect(() => {
    if (presignedUrl && selectedFile && !isUploadingFile) {
      uploadFileToPipefy();
    }
  }, [presignedUrl, selectedFile, uploadFileToPipefy, isUploadingFile]);

  return (
    <div className="w-full">
      <div className="space-y-4 text-left">
        {softSkills.map((skill, index) => {
          const totalDimensions = skill.dimensions.length;
          const answeredDimensions = Object.values(
            responses[skill.name] || {},
          ).filter((val) => val && val.trim() !== "").length;
          return (
            <div key={index}>
              <div className="flex items-center justify-between px-6 py-5">
                <h2 className="text-lg font-medium">{skill.name}</h2>
                <span
                  className={cn(
                    "font-medium",
                    answeredDimensions === totalDimensions
                      ? "text-green-500"
                      : "text-[#FF9500]",
                  )}
                >
                  {answeredDimensions} de {totalDimensions}
                </span>
              </div>

              {skill.dimensions.map((dimension, dimIndex) => (
                <Accordion
                  key={dimIndex}
                  type="single"
                  collapsible
                  className="w-full"
                >
                  <AccordionItem value={`${skill.name}-${dimension.name}`}>
                    <AccordionTrigger className="bg-gray-50 px-6 py-4 hover:bg-gray-100">
                      <div className="flex items-center">
                        <div
                          className={cn(
                            "mr-4 h-2 w-2 rounded-full",
                            responses[skill.name]?.[dimension.name]
                              ? "bg-green-500"
                              : "bg-[#FF9500]",
                          )}
                        ></div>
                        <span className="font-medium">
                          Dimensión {dimension.name.toLowerCase()}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-6 py-4">
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium">Pregunta:</p>
                          <p className="mt-1">{dimension.question}</p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <p className="mb-2 font-medium">
                            Respuesta del candidato:
                          </p>
                          <Textarea
                            className="min-h-[120px] rounded border p-4"
                            value={
                              responses[skill.name]?.[dimension.name] || ""
                            }
                            onChange={(e) =>
                              handleResponseChange(
                                skill.name,
                                dimension.name,
                                e.target.value,
                              )
                            }
                            placeholder="Escribe tu respuesta aquí..."
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          );
        })}
      </div>
      {!isCompleted && (
        <div className="flex justify-end">
          <Button
            disabled={
              isGetPresignedUrlPending ||
              isUploadingPdf ||
              isUploadingFile ||
              softSkills.some((skill) =>
                skill.dimensions.some(
                  (dimension) =>
                    !responses[skill.name] ||
                    !responses[skill.name][dimension.name] ||
                    responses[skill.name][dimension.name].trim() === "",
                ),
              )
            }
            variant="talentGreen"
            className="ml-auto mt-4"
            onClick={generateAssessmentPdfFile}
          >
            {(isUploadingPdf ||
              isGetPresignedUrlPending ||
              isUploadingFile) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Enviar prueba
          </Button>
        </div>
      )}
    </div>
  );
};
