import React, { useRef, useState } from "react";
import { Button } from "../ui/button";
import { Image as ImageIcon } from "lucide-react";
import { Text } from "../Typography/Text";

interface FileDropzoneProps {
  onImageProcessed: (base64Value: string) => void; // Callback prop
}
export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onImageProcessed,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) await processFile(file);
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (file.type.startsWith("image/")) {
      const base64 = await convertToBase64(file);
      onImageProcessed(base64);
    } else {
      setErrorMessage("Only image files are allowed.");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="flex h-32 w-64 flex-col items-center justify-center gap-6 border-2 border-dotted border-black text-gray-600 hover:border-gray-600"
      >
        <ImageIcon className="h-8 w-8 text-muted-foreground" />
        <Text className="text-lg font-semibold text-foreground">
          Arrastra tu imagen aqui
        </Text>
      </div>
      <Button onClick={handleButtonClick}>
        Seleccionar una imagen de tu computador
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
    </div>
  );
};
