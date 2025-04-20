import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";

import {
  Control,
  FieldErrors,
  Path,
  UseFormStateReturn,
  FieldValues,
} from "react-hook-form";
import { cn } from "@/lib/utils";

type FormInputProps<TSchema extends FieldValues> = {
  disabled?: boolean;
  name: Path<TSchema>;
  label: string;
  placeholder?: string;
  description?: string;
  type?: string;
  testId: string;
  control: Control<TSchema>;
  errors: FieldErrors<TSchema>;
  dirtyFields: UseFormStateReturn<TSchema>["dirtyFields"];
  classNames?: string;
  getErrorMessage: (key?: string) => string;
};

export function FormInput<TSchema extends FieldValues>({
  name,
  label,
  placeholder,
  description,
  type = "text",
  testId,
  control,
  errors,
  dirtyFields,
  getErrorMessage,
  classNames,
  disabled = false,
}: FormInputProps<TSchema>) {
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
              <Input
                {...field}
                disabled={disabled}
                type={type}
                data-testid={testId}
                placeholder={placeholder}
                className={cn(
                  "focus-visible:ring-offset-0",
                  "focus-visible:ring-talent-orange-500",
                  isTouched &&
                    !hasError &&
                    "border-green-500 focus-visible:ring-green-500",
                  hasError &&
                    "border-red-500 bg-red-50 focus-visible:ring-red-500",
                )}
              />
            </FormControl>
            <motion.div layout className="flex min-h-[20px] items-center">
              <AnimatePresence mode="wait">
                {hasError && (
                  <motion.span
                    key="error-message"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-red-500"
                  >
                    {getErrorMessage(errors[name]?.message?.toString())}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          </FormItem>
        );
      }}
    />
  );
}
