"use client";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Text } from "../Typography/Text";

interface PdfDropzoneProps {
  onPdfAccepted: (files: File[]) => void;
  label?: string;
  error?: string;
}

export function PdfDropzone({
  onPdfAccepted,
  label = "Arrastra aquí tus archivos o haz clic para seleccionar",
  error: externalError,
}: PdfDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== "application/pdf") {
        setInternalError("Solo se permiten archivos PDF.");
        continue;
      }
      validFiles.push(file);
    }
    if (validFiles.length === 0) return;
    setInternalError(null);
    onPdfAccepted(validFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const error = externalError ?? internalError;

  return (
    <div
      className="flex cursor-pointer flex-col items-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 transition hover:bg-gray-100"
      onClick={() => inputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleChange}
        tabIndex={-1}
        multiple
      />
      <Text className="mb-2">{label}</Text>
      <Button variant="outline" type="button" tabIndex={-1}>
        Seleccionar archivos
      </Button>
      {error && <Text className="mt-2 text-red-500">{error}</Text>}
    </div>
  );
}
