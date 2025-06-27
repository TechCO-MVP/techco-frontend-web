"use client";
import { useState, useRef } from "react";
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

import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { usePresignedUrl } from "@/hooks/use-presigned-url";
import { useUploadFile } from "@/hooks/use-file-upload";
import * as actions from "@/actions";

export function AttachFileDialog({
  organizationId,
  cardId,
}: {
  organizationId: string;
  cardId: string;
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [presignedUrls, setPresignedUrls] = useState<Record<string, string>>(
    {},
  );
  const { uploadFile } = useUploadFile();

  const presignedFileMap = useRef<Record<string, string>>({});
  const requestedPresignedUrls = useRef<Set<string>>(new Set());
  const { mutate: getPresignedUrl, isPending: isGetPresignedUrlPending } =
    usePresignedUrl({
      onSuccess: (data, variables) => {
        setPresignedUrls((prev) => ({
          ...prev,
          [variables.fileName]: data.createPresignedUrl.url,
        }));
      },
      onError: (data) => {
        console.log("usePresignedUrl error", data);
      },
    });

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.type === "application/pdf");
    if (validFiles.length !== files.length) {
      setError("Solo se permiten archivos PDF.");
      return;
    }
    setError(null);
    setSelectedFiles((prev) => {
      const existingNames = new Set(prev.map((f) => f.name));
      const newFiles = validFiles.filter((f) => !existingNames.has(f.name));
      // Request presigned URL for each new file, only if not already requested
      newFiles.forEach((file) => {
        const fileName = file.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9.\-_]/g, "");
        if (!requestedPresignedUrls.current.has(fileName)) {
          requestedPresignedUrls.current.add(fileName);
          presignedFileMap.current[fileName] = fileName;
          getPresignedUrl({
            organizationId,
            fileName,
          });
        }
      });
      return [...prev, ...newFiles];
    });
  };

  const handleUpload = async () => {
    if (!selectedFiles.length) return;
    const filePaths: string[] = [];

    for (const file of selectedFiles) {
      const url =
        presignedUrls[
          file.name
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^a-z0-9.\-_]/g, "")
        ];
      if (!url) continue;
      await uploadFile(url, file, file.type);
      const filePath = new URL(url).pathname.slice(1);
      filePaths.push(filePath);
    }
    console.log(
      "%c[Debug] updateAttachments",
      "background-color: teal; font-size: 20px; color: white",
      { filePaths, cardId },
    );
    await actions.updateAttachments(cardId, filePaths);

    setOpen(false);
    setSelectedFiles([]);
    setPresignedUrls({});
    setError(null);
    toast({
      title: "Archivos subidos correctamente",
      description: "Todos los archivos se han subido correctamente",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="max-w-[200px]" variant="talentGreen">
          Adjuntar documentos
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Adjuntar documentos (PDF)</DialogTitle>
        <DialogDescription>
          Adjunta los archivos para continuar con el proceso.
        </DialogDescription>
        <PdfDropzone onPdfAccepted={handleFiles} />
        {selectedFiles.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            <Text className="text-sm text-gray-700">
              Archivos seleccionados:
            </Text>
            {selectedFiles.map((file) => (
              <Text key={file.name} className="font-medium text-gray-900">
                {file.name}
              </Text>
            ))}
          </div>
        )}
        {error && <Text className="mt-2 text-red-500">{error}</Text>}
        {selectedFiles.length > 0 && (
          <Button
            className="mt-4 w-full"
            variant="talentGreen"
            onClick={handleUpload}
            disabled={isGetPresignedUrlPending}
          >
            {isGetPresignedUrlPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Subir archivos
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
