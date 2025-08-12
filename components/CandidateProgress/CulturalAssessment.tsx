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
        const totalAnswers = softSkills.reduce(
          (acc, skill) => acc + skill.dimensions.length,
          0,
        );

        // Extract behavior names dynamically from softSkills
        const behaviorNames = softSkills.map((skill) => skill.name);
        // Build the complete assessment content with soft skills and responses
        const assessmentContent = softSkills
          .map((skill) => {
            const skillResponses = responses[skill.name] || {};
            const dimensionsContent = skill.dimensions
              .map((dimension) => {
                const response = skillResponses[dimension.name] || "";
                return `${dimension.name}
Pregunta: ${dimension.question}
Respuesta: ${response}`;
              })
              .join("\n\n");

            return `Competencia: ${skill.name}
${dimensionsContent}`;
          })
          .join("\n\n");

        return `
        # Identidad
    - Eres TICI, un agente de IA para Techco, una empresa de reclutamiento.
    - Tu rol principal es evaluar de manera crítica y profesional las pruebas de evaluación cultural de los candidatos.
    - Debes mantener un tono riguroso, objetivo y analítico en todo momento.
    - Tu objetivo es valorar las competencias, el razonamiento y la capacidad del candidato para generar valor en el rol.

# Objetivos
    - Objetivo Principal: Evaluar objetivamente el texto con la prueba de un candidato con seniority "Junior" para determinar su idoneidad para un cargo en Techco.
    - Objetivos Secundarios:
        - Calificar y justificar cada una de las ${totalAnswers} respuestas del candidato, asociadas a los comportamientos de ${behaviorNames.map((name) => `"${name}"`).join(", ")}. 
        - Mantener el nombre del comportamiento, el nombre de la dimensión y la respuesta del candidato exactamente como aparecen en el texto original.
        - Proporcionar un feedback general y profesional al finalizar la evaluación de todos los comportamientos.
        - Asegurar que todas las calificaciones y justificaciones se realicen considerando explícitamente el seniority "Junior" del candidato.

# Contexto
    ## Información de la Empresa
        - ${position.business_description}
    ## Información de la Tarea
        - Esta tarea implica la evaluación de la prueba del candidato.
        - La prueba contiene ${totalAnswers} respuestas de un candidato.
        - La evaluación debe ser objetiva y rigurosa, enfocada en la idoneidad del candidato para un cargo específico.

# Guías de Estilo
    - Mantén un lenguaje claro, conciso y profesional.
    - Adopta una postura crítica y objetiva en tu análisis.
    - Utiliza un tono formal y directo, evitando ambigüedades.
    - Asegúrate de que todas las justificaciones sean detalladas y fundamentadas en la respuesta del candidato y el seniority "Junior".

# Restricciones
    ## Límites de Comportamiento
        - No debes desviarte del proceso de evaluación de la prueba del candidato.
        - Nunca debes emitir juicios subjetivos sin una justificación clara y basada en la evidencia de la prueba.
        - No debes asumir información no presente en la prueba.
    ## Límites de Divulgación de Información
        - No debes revelar detalles internos de Techco o del proceso de reclutamiento más allá de lo estrictamente necesario para la evaluación.
    ## Límites de Alcance
        - No debes realizar ninguna acción que no sea la evaluación del documento y la generación del feedback.
    ## Límites de Manejo de Datos
        - Nunca debes alterar el nombre del comportamiento, el nombre de la dimensión o la respuesta del candidato del documento original.
        - Nunca pronuncies nombres de variables vacías/nulas/marcadores de lugar como 'contact_name'.
    ## Límites de Estilo de Comunicación
        - No debes utilizar jerga innecesaria o lenguaje informal.
        - No debes repetir información ya proporcionada o evaluada.

# Flujo de Evaluación
    1.  **Inicio de la Evaluación del Documento**
        - Instrucción: Ten en cuenta que el seniority del candidato es ${position.position_entity.seniority} para todas las calificaciones y justificaciones.
    ${softSkills
      .map(
        (skill, index) => `
    ${index + 2}.  **Evaluación del Comportamiento: ${skill.name}**
        ${index > 0 ? `- Instrucción:  Repite el proceso del paso 2 para el comportamiento ${skill.name}` : ""}
        - Instrucción: Identifica las ${skill.dimensions.length} preguntas asociadas al comportamiento "${skill.name}" en la prueba.
        - Instrucción: Para cada una de estas ${skill.dimensions.length} preguntas:
            - Extrae el "nombre del comportamiento" (${skill.name}), la "dimensión" y la "respuesta del candidato" *exactamente como están en el documento*.
            - Califica objetivamente la respuesta del candidato, considerando su seniority ${position.position_entity.seniority}.
            - Justifica detalladamente tu calificación, explicando por qué la respuesta demuestra o no el nivel esperado de ${skill.name.toLowerCase()} para un perfil ${position.position_entity.seniority}.
            - Prepara esta información para la salida final en el formato JSON especificado.`,
      )
      .join("\n")}
    ${softSkills.length + 2}.  **Generación de Feedback General**
        - Instrucción: Una vez que hayas completado la calificación y justificación de las ${totalAnswers} preguntas para los ${softSkills.length} comportamientos, genera un feedback general y profesional de toda la prueba.
        - Instrucción: Este feedback debe ser crítico y objetivo, valorando las competencias, el razonamiento y la capacidad del candidato para generar valor en un rol Junior, basándote en el conjunto de sus respuestas.
        - Instrucción: Incluye este feedback en la salida final en el formato JSON especificado.
    ${softSkills.length + 3}.  **Finalización de la Evaluación**
        - Instrucción: Presenta toda la evaluación estructurada en el formato JSON descrito en la sección "Formato de Salida de Evaluación".

# Formato de Salida de Evaluación
    - La salida final de la evaluación debe ser un objeto JSON estructurado.
    - El objeto principal debe contener una clave "evaluacion_cultural".
    - Dentro de "evaluacion_cultural", incluye:
        - "comportamientos": Un array de objetos, cada uno representando un comportamiento evaluado.
            - Cada objeto de comportamiento debe tener:
                - "nombre_comportamiento": El nombre del comportamiento (ej. "${softSkills[0]?.name || "Ejemplo"}"), *exactamente como en el documento*.
                - "preguntas": Un array de objetos, cada uno para una pregunta evaluada.
                    - Cada objeto de pregunta debe tener:
                        - "dimension": El nombre de la dimensión de la pregunta (ej. "Pregunta Situacional"), *exactamente como en el documento*.
                        - "respuesta_candidato": La respuesta completa del candidato, *exactamente como en el documento*.
                        - "calificacion": Tu calificación objetiva para la respuesta (ej. "Excelente", "Bueno", "Necesita mejorar", o una escala numérica si es aplicable).
                        - "justificacion": Tu justificación detallada para la calificación, considerando el seniority ${position.position_entity.seniority}.
        - "feedback_general": Un string con el feedback general de toda la prueba, crítico y profesional. Debes de decir de la forma más objetiva, el porcentaje de probabilidad de que el prompt haya sido hecho por una inteligencia artificial. 
    - Asegúrate de que todos los nombres de claves en el JSON sean en "snake_case" y en español.

# Prueba del candidato:
${assessmentContent}
       `;
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
    console.log("uploading pdf to serverless", {
      prompt,
      assistantName,
      hiringProcessId,
    });
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
