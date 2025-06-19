"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  PositionConfigurationPhaseTypes,
  type Assessment,
  AssistantName,
  type PositionData,
  type TechnicalAssessment as TechnicalAssessmentType,
} from "@/types";
import React, { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { pdf } from "@react-pdf/renderer";
import { TechnicalAssessmentPdf } from "./TechnicalAssessmentPdf";
import { UPLOAD_FILE_PROMPT } from "@/constants";
import { useUploadPdf } from "@/hooks/use-upload-pdf";
import { usePresignedUrl } from "@/hooks/use-presigned-url";
import { Button } from "../ui/button";
import { useUploadFile } from "@/hooks/use-file-upload";
import * as actions from "@/actions";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PipefyCardResponse, PipefyFieldValues } from "@/types/pipefy";
export const TechnicalAssessment: React.FC<{
  position: PositionData;
  assessment: TechnicalAssessmentType;
  card: PipefyCardResponse["card"];
  assistantName: AssistantName;
  organizationId: string;
  hiringProcessId: string;
  fieldId: string;
  cardId: string;
}> = ({
  assessment,
  position,
  card,
  assistantName,
  organizationId,
  hiringProcessId,
  fieldId,
  cardId,
}) => {
  const [asnwer, setAnswer] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState("");
  const [isUploadingFile, setIsUploadingFile] = useState(false);
  const { uploadFile } = useUploadFile();
  const [isCompleted, setIsCompleted] = useState(false);

  const { mutate: getPresignedUrl, isPending: isGetPresignedUrlPending } =
    usePresignedUrl({
      onSuccess: (data) => {
        setIsCompleted(true);
        console.log("usePresignedUrl success", data);
        setPresignedUrl(data.createPresignedUrl.url);
      },
      onError: (data) => {
        console.log("usePresignedUrl error", data);
      },
    });
  // Check if technical assessment was already uploaded
  const existingAssessment = card.attachments.find(
    (attachment) =>
      attachment.field.index_name ===
      PipefyFieldValues.TechnicalAssessmentResult,
  );

  useEffect(() => {
    if (existingAssessment) {
      setIsCompleted(true);
    }
  }, [existingAssessment]);
  const { mutate: uploadPdf, isPending: isUploadingPdf } = useUploadPdf({
    onSuccess: async (data) => {
      console.log("uploadPdf success", data);
      console.log("getting presigned url");
      getPresignedUrl({
        organizationId,
        fileName: "technical-assessment.pdf",
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  useEffect(() => {
    if (existingAssessment) {
      setIsCompleted(true);
    }
  }, [existingAssessment]);

  const buildPrompt = (assistantName: AssistantName) => {
    try {
      const culturalFitAssessment = position.position_assessments.find(
        (assessment) =>
          assessment.type === PositionConfigurationPhaseTypes.SOFT_SKILLS,
      )?.data as Assessment;
      const technicalAssessment = position.position_assessments.find(
        (assessment) =>
          assessment.type === PositionConfigurationPhaseTypes.TECHNICAL_TEST,
      )?.data as TechnicalAssessmentType;
      if (assistantName === AssistantName.CULTURAL_FIT_ASSESSMENT) {
        if (!culturalFitAssessment) return UPLOAD_FILE_PROMPT;
        return `Descripcion de la empresa: ${position.business_description}.
      Descripcion de la posicion: ${position.position_description}.
      Tiene personas a cargo: ${culturalFitAssessment.is_lead_position ? "Si" : "No"}.
      Autonomia: ${culturalFitAssessment.how_much_autonomy}.
      Principales retos: ${culturalFitAssessment.challenges_of_the_position}.
      Assessment a evaluar: ${JSON.stringify(culturalFitAssessment.soft_skills)}.
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
      ${UPLOAD_FILE_PROMPT}
     `;
      }
      return UPLOAD_FILE_PROMPT;
    } catch (error) {
      console.error(error);
      return UPLOAD_FILE_PROMPT;
    }
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
        title: "¡Recibimos tu prueba! ",
        description: "Te contamos pronto qué sigue.",
      });
      setAnswer("");
    } catch (error) {
      console.error(error);
      setIsUploadingFile(false);
    }
  };

  const generateAssessmentPdfFile = async () => {
    console.log("generating pdf");
    const blob = await pdf(
      <TechnicalAssessmentPdf
        technicalAssessment={assessment}
        response={asnwer}
      />,
    ).toBlob();
    // download the file
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "technical-assessment.pdf";
    // a.click();
    // URL.revokeObjectURL(url);
    // return;
    const file = new File([blob], "technical-assessment.pdf", {
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
  useEffect(() => {
    if (presignedUrl && selectedFile && !isUploadingFile) {
      uploadFileToPipefy();
    }
  }, [presignedUrl, selectedFile, uploadFileToPipefy, isUploadingFile]);
  return (
    <div className="space-y-4 text-left">
      <Accordion type="multiple" className="w-full">
        <AccordionItem value="assesment_goal">
          <AccordionTrigger className="bg-gray-50 px-6 py-4 hover:bg-gray-100">
            El Objetivo
          </AccordionTrigger>
          <AccordionContent className="flex items-center px-6 py-4">
            <p>{assessment.assesment_goal}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="challenge">
          <AccordionTrigger className="bg-gray-50 px-6 py-4 hover:bg-gray-100">
            El Reto
          </AccordionTrigger>
          <AccordionContent className="flex items-center px-6 py-4">
            <p>{assessment.challenge}</p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="your_mission" className="border-0">
          <AccordionTrigger className="bg-gray-50 px-6 py-4 hover:bg-gray-100">
            Tu misión
          </AccordionTrigger>
          <AccordionContent className="flex flex-col items-center gap-4 px-6 py-4">
            <p>{assessment.your_mission}</p>
            <div className="w-full">
              <p className="mb-2 font-medium">Respuesta del candidato:</p>
              <Textarea
                className="min-h-[120px] w-full rounded border p-4"
                value={asnwer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Escribe tu respuesta aquí..."
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      {!isCompleted && (
        <div className="flex justify-end">
          <Button
            disabled={isGetPresignedUrlPending || isUploadingPdf || !asnwer}
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
