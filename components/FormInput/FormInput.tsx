import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
  Control,
  FieldErrors,
  Path,
  UseFormStateReturn,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";
import { Text } from "../Typography/Text";

type FormInputProps<TSchema extends FieldValues> = {
  name: Path<TSchema>;
  label: string;
  placeholder?: string;
  type?: string;
  testId: string;
  control: Control<TSchema>;
  errors: FieldErrors<TSchema>;
  dirtyFields: UseFormStateReturn<TSchema>["dirtyFields"];
  getErrorMessage: (key?: string) => string;
};

export function FormInput<TSchema extends FieldValues>({
  name,
  label,
  placeholder,
  type = "text",
  testId,
  control,
  errors,
  dirtyFields,
  getErrorMessage,
}: FormInputProps<TSchema>) {
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
            <FormControl>
              <Input
                {...field}
                type={type}
                data-testid={testId}
                placeholder={placeholder}
                className={cn(
                  isTouched &&
                    !hasError &&
                    "border-green-500 focus-visible:ring-green-500",
                  hasError && "border-red-500 focus-visible:ring-red-500",
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
