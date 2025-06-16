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
import { PipefyCardResponse } from "@/types/pipefy";
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

  const buildPrompt = (assistantName: AssistantName) => {
    try {
      const culturalFitAssessment = position.position_assessments.find(
        (assessment) =>
          assessment.type === PositionConfigurationPhaseTypes.SOFT_SKILLS,
      )?.data as Assessment;
      const technicalAssessment = position.position_assessments.find(
        (assessment) =>
          assessment.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
      )?.data as TechnicalAssessment;
      if (assistantName === AssistantName.CULTURAL_FIT_ASSESSMENT) {
        if (!culturalFitAssessment) return UPLOAD_FILE_PROMPT;
        return `Descripcion de la empresa: ${position.business_description}.
      Descripcion de la posicion: ${position.position_description}.
      Tiene personas a cargo: ${culturalFitAssessment.is_lead_position ? "Si" : "No"}.
      Autonomia: ${culturalFitAssessment.how_much_autonomy}.
      Principales retos: ${culturalFitAssessment.challenges_of_the_position}.
      ${UPLOAD_FILE_PROMPT}
     `;
      }
      if (assistantName === AssistantName.TECHNICAL_ASSESSMENT) {
        if (!technicalAssessment) return UPLOAD_FILE_PROMPT;
        return `Descripcion de la empresa ${position.business_description}.
      Descripcion de la posicion ${position.position_description}.
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
      console.log("uploadPdf success", data);
      console.log("getting presigned url");
      getPresignedUrl({
        organizationId,
        fileName: "cultural-assessment.pdf",
      });
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
      toast({
        title: "Archivo subido correctamente",
        description: "El archivo se ha subido correctamente",
      });
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
          {(isUploadingPdf || isGetPresignedUrlPending || isUploadingFile) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Enviar prueba
        </Button>
      </div>
    </div>
  );
};
