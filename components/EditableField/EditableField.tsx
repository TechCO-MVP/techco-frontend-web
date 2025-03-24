import { FormEvent, useCallback, useState, useTransition } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  PipefyFieldType,
  PipefyPipe,
  UpdateFieldResponse,
} from "@/types/pipefy";
import { ArrowDownToLine, Loader2, SquarePen } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { usePresignedUrl } from "@/hooks/use-presigned-url";
import { useUploadFile } from "@/hooks/use-file-upload";
interface EditableFieldProps {
  cardId: string;
  label: string;
  type: PipefyFieldType;
  value: string | undefined;
  options?: string[];
  name: string;
  action: (formData: FormData) => Promise<UpdateFieldResponse>;
  pipe: PipefyPipe;
}

export const EditableField: React.FC<EditableFieldProps> = ({
  cardId,
  label,
  type,
  value,
  options = [],
  name,
  action,
  pipe,
}) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [presignedUrl, setPresignedUrl] = useState("");
  const { uploadFile, uploading, error } = useUploadFile();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const fileName = file.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9.\-_]/g, "");

    mutate({
      organizationId: pipe.organizationId,
      fileName: fileName,
    });
  };
  const { mutate } = usePresignedUrl({
    onSuccess: (data) => {
      console.log("usePresignedUrl success", data);
      setPresignedUrl(data.createPresignedUrl.url);
    },
    onError: (data) => {
      console.log("usePresignedUrl error", data);
    },
  });
  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form = event.currentTarget as HTMLFormElement;
      const formData = new FormData(form);
      if (type === "attachment") {
        if (!selectedFile) return;
        const filePath = new URL(presignedUrl).pathname.slice(1);
        await uploadFile(presignedUrl, selectedFile, selectedFile.type);
        formData.set("type", type);
        formData.set(name, filePath);
      }
      startTransition(async () => {
        const response = await action(formData);
        console.log(response);
        if (response.updateCardField) {
          setIsEditing(false);
          queryClient.invalidateQueries({
            queryKey: QUERIES.PIPE_DATA(pipe.id),
          });
        }
      });
    },
    [
      presignedUrl,
      action,
      name,
      pipe.id,
      queryClient,
      selectedFile,
      type,
      uploadFile,
    ],
  );
  const renderInput = () => {
    switch (type) {
      case "short_text":
      case "email":
      case "cpf":
      case "cnpj":
      case "currency":
      case "number":
      case "phone":
        return (
          <Input
            id={name}
            name={name}
            defaultValue={value}
            disabled={!isEditing}
            className="w-full"
          />
        );

      case "long_text":
        return (
          <Textarea
            id={name}
            name={name}
            defaultValue={value}
            disabled={!isEditing}
            className="w-full"
          />
        );

      case "attachment": {
        if (!value) return null;
        const url = JSON.parse(value);
        const fileName = new URL(url).pathname.split("/").pop();

        return isEditing ? (
          <>
            <Input
              type="file"
              id={name}
              name={name}
              disabled={!isEditing}
              className="w-full"
              onChange={handleFileChange}
            />
            {error && <p className="text-red-600">Error: {error}</p>}
          </>
        ) : (
          <div
            onClick={() => window.open(url, "_blank")}
            className="group flex w-full cursor-pointer items-center justify-start gap-4 rounded-md p-2 hover:bg-slate-100"
          >
            <ArrowDownToLine className="group-hover:stroke-slate-400" />
            {fileName}
          </div>
        );
      }

      case "statement":
        return null;

      case "select":
      case "label_select":
        return (
          <Select name={name} defaultValue={value} disabled={!isEditing}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccione" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

      case "radio_horizontal":
      case "radio_vertical":
        return (
          <div className="flex space-x-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-1">
                <input
                  type="radio"
                  name={name}
                  value={option}
                  defaultChecked={value === option}
                  disabled={!isEditing}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "checklist_horizontal":
      case "checklist_vertical":
        return (
          <div className="flex flex-wrap gap-2">
            {options.map((option) => (
              <label key={option} className="flex items-center space-x-1">
                <input
                  type="checkbox"
                  name={name}
                  value={option}
                  defaultChecked={value?.includes(option)}
                  disabled={!isEditing}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      case "date":
      case "due_date": {
        // Ensure value is a valid date, otherwise use an empty string
        const dateValue = value ? format(new Date(value), "yyyy-MM-dd") : "";

        return (
          <Input
            type="date"
            id={name}
            name={name}
            defaultValue={dateValue}
            disabled={!isEditing}
            className="w-full"
          />
        );
      }

      case "datetime": {
        // Ensure value is a valid datetime, otherwise use an empty string
        const datetimeValue = value
          ? format(new Date(value), "yyyy-MM-dd'T'HH:mm")
          : "";

        return (
          <Input
            type="datetime-local"
            id={name}
            name={name}
            defaultValue={datetimeValue}
            disabled={!isEditing}
            className="w-full"
          />
        );
      }

      case "time":
        return (
          <Input
            type="time"
            id={name}
            name={name}
            defaultValue={value}
            disabled={!isEditing}
            className="w-full"
          />
        );

      default:
        return (
          <Input
            id={name}
            name={name}
            defaultValue={value}
            disabled={!isEditing}
            className="w-full"
          />
        );
    }
  };

  if (type === "statement") return null;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex w-full flex-col items-end justify-between space-y-4"
    >
      <div className="flex w-full flex-col items-start space-y-2">
        <Label
          htmlFor={name}
          className="flex w-full items-center justify-between overflow-hidden"
        >
          <span className="flex-grow truncate">{label}</span>
          {!isEditing && (
            <Button
              type="button"
              variant="ghost"
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(true);
              }}
              className="flex-shrink-0"
            >
              <SquarePen />
            </Button>
          )}
        </Label>

        {renderInput()}
      </div>
      <input type="hidden" value={cardId} name="card_id" />
      <input type="hidden" value={name} name="field_id" />
      {isEditing && (
        <div className="flex w-full items-center justify-start gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={
              uploading ||
              isPending ||
              (type === "attachment" ? (selectedFile ? false : true) : false)
            }
            type="submit"
            variant="default"
          >
            {(uploading || isPending) && <Loader2 className="animate-spin" />}
            Save
          </Button>
        </div>
      )}
    </form>
  );
};
