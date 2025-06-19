"use client";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Text } from "../Typography/Text";

interface PdfDropzoneProps {
  onPdfAccepted: (file: File) => void;
  label?: string;
  error?: string;
}

export function PdfDropzone({
  onPdfAccepted,
  label = "Arrastra aquí tu PDF o haz clic para seleccionar",
  error: externalError,
}: PdfDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/pdf") {
      setInternalError("Solo se permiten archivos PDF.");
      return;
    }
    setInternalError(null);
    onPdfAccepted(file);
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
      />
      <Text className="mb-2">{label}</Text>
      <Button variant="outline" type="button" tabIndex={-1}>
        Seleccionar PDF
      </Button>
      {error && <Text className="mt-2 text-red-500">{error}</Text>}
    </div>
  );
}
