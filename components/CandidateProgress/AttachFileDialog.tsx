"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PdfDropzone } from "@/components/FileDropzone/PdfDropzone"; // Ajusta el import según tu estructura
import { Text } from "../Typography/Text";
import { AssistantName } from "@/types";
import { useUploadPdf } from "@/hooks/use-upload-pdf";
import { UPLOAD_FILE_PROMPT } from "@/constants";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePresignedUrl } from "@/hooks/use-presigned-url";
import { useUploadFile } from "@/hooks/use-file-upload";
import * as actions from "@/actions";
import { useUpdateHiringProcessCustomFields } from "@/hooks/use-update-hiring-process-custom-fields";

export function AttachFileDialog({
  hiringProcessId,
  assistantName,
  organizationId,
  cardId,
  fieldId,
  nextPhase,
}: {
  hiringProcessId: string;
  assistantName: AssistantName;
  organizationId: string;
  cardId: string;
  fieldId: string;
  nextPhase?: {
    id: string;
    name: string;
  };
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState("");
  const { uploadFile } = useUploadFile();

  const { mutate: updateHiringProcessCustomFields } =
    useUpdateHiringProcessCustomFields({
      onSuccess: (data) => {
        console.log("updateHiringProcessCustomFields success", data);
      },
      onError: (error) => {
        console.error("Error updating hiring process custom fields", error);
      },
    });
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
  const { mutate: uploadPdf, isPending } = useUploadPdf({
    onSuccess: async (data) => {
      console.log(data);
      setOpen(false);
      setSelectedFile(null);
      setError(null);
      toast({
        title: "Archivo subido correctamente",
        description: "El archivo se ha subido correctamente",
      });

      if (!selectedFile) return;
      await uploadFile(presignedUrl, selectedFile, selectedFile.type);
      const formData = new FormData();
      const filePath = new URL(presignedUrl).pathname.slice(1);
      formData.append("type", "attachment");
      formData.append("field_id", fieldId);
      formData.append("card_id", cardId);
      formData.append(fieldId, filePath);
      await actions.updateField(formData);
      if (!nextPhase) return;
      updateHiringProcessCustomFields({
        id: hiringProcessId,
        phases: {
          [nextPhase.id]: {
            phase_id: nextPhase.id,
            custom_fields: { process_id: data.process_id },
          },
        },
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const handleFile = (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Solo se permiten archivos PDF.");
      setSelectedFile(null);
      return;
    }
    const fileName = file.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.\-_]/g, "");
    getPresignedUrl({
      organizationId,
      fileName,
    });
    setError(null);
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    // TODO: Implement upload logic here
    console.log("Uploading file:", selectedFile);
    uploadPdf({
      file: selectedFile,
      hiringProcessId,
      assistantName,
      message: UPLOAD_FILE_PROMPT,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="max-w-[200px]" variant="talentGreen">
          Adjuntar prueba
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Adjuntar prueba (PDF)</DialogTitle>
        <DialogDescription>
          Adjunta un archivo PDF para continuar con el proceso.
        </DialogDescription>
        <PdfDropzone onPdfAccepted={handleFile} />
        {selectedFile && (
          <div className="mt-2 flex items-center gap-2">
            <Text className="text-sm text-gray-700">Archivo seleccionado:</Text>
            <Text className="font-medium text-gray-900">
              {selectedFile.name}
            </Text>
          </div>
        )}
        {error && <Text className="mt-2 text-red-500">{error}</Text>}
        {selectedFile && (
          <Button
            className="mt-4 w-full"
            variant="talentGreen"
            onClick={handleUpload}
            disabled={isPending || isGetPresignedUrlPending}
          >
            {isPending ||
              (isGetPresignedUrlPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ))}
            Subir archivo
          </Button>
        )}
        <DialogClose asChild>
          <Button variant="ghost" type="button">
            Cerrar
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
