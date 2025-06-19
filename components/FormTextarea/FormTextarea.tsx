import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import {
  Control,
  FieldErrors,
  Path,
  UseFormStateReturn,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Text } from "../Typography/Text";

type FormTextareaProps<TSchema extends FieldValues> = {
  name: Path<TSchema>;
  label: string;
  placeholder?: string;
  description?: string;
  testId: string;
  control: Control<TSchema>;
  errors: FieldErrors<TSchema>;
  dirtyFields: UseFormStateReturn<TSchema>["dirtyFields"];
  classNames?: string;
  getErrorMessage: (key?: string) => string;
};

export function FormTextarea<TSchema extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  testId,
  control,
  errors,
  dirtyFields,
  getErrorMessage,
  classNames,
}: FormTextareaProps<TSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isTouched = !!dirtyFields[name as keyof typeof dirtyFields];
        const hasError = !!errors[name];

        return (
          <FormItem className={cn("mx-auto mb-3 w-full max-w-xs", classNames)}>
            <FormLabel>{label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormControl>
              <Textarea
                {...field}
                data-testid={testId}
                placeholder={placeholder}
                className={cn(
                  "focus-visible:ring-offset-0",
                  isTouched &&
                    !hasError &&
                    "border-green-500 focus-visible:ring-green-500",
                  hasError &&
                    "border-red-500 bg-red-50 focus-visible:ring-red-500",
                )}
              />
            </FormControl>
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
