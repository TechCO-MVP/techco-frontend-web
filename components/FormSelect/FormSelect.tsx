import {
  Control,
  FieldErrors,
  Path,
  UseFormStateReturn,
  FieldValues,
} from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Text } from "@/components/Typography/Text";
import { cn } from "@/lib/utils";

type FormSelectProps<TSchema extends FieldValues> = {
  name: Path<TSchema>;
  label: string;
  placeholder?: string;
  control: Control<TSchema>;
  errors: FieldErrors<TSchema>;
  dirtyFields: UseFormStateReturn<TSchema>["dirtyFields"];
  options: { value: string; label: string }[];
  getErrorMessage: (key?: string) => string;
};

export function FormSelect<TSchema extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  errors,
  dirtyFields,
  options,
  getErrorMessage,
}: FormSelectProps<TSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isTouched = !!dirtyFields[name as keyof typeof dirtyFields];
        const hasError = !!errors[name];

        return (
          <FormItem className="mx-auto mb-3 w-full max-w-xs">
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl
                className={cn(
                  isTouched &&
                    !hasError &&
                    "border-green-500 focus-visible:ring-green-500",
                  hasError && "border-red-500 focus-visible:ring-red-500",
                )}
              >
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex min-h-[20px] items-center">
              {hasError && (
                <Text size="small" type="span" className="m-0 text-red-500">
                  {getErrorMessage(errors[name]?.message?.toString())}
                </Text>
              )}
            </div>
          </FormItem>
        );
      }}
    />
  );
}
