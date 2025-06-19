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
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type FormSelectProps<TSchema extends FieldValues> = {
  name: Path<TSchema>;
  label: string;
  testId: string;
  placeholder?: string;
  control: Control<TSchema>;
  errors: FieldErrors<TSchema>;
  dirtyFields: UseFormStateReturn<TSchema>["dirtyFields"];
  classNames?: string;
  options: { value: string; label: string }[];
  getErrorMessage: (key?: string) => string;
};

export function FormSelect<TSchema extends FieldValues>({
  name,
  label,
  placeholder,
  control,
  errors,
  testId,
  dirtyFields,
  options,
  getErrorMessage,
  classNames,
}: FormSelectProps<TSchema>) {
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl
                className={cn(
                  "focus-visible:ring-talent-orange-500",
                  isTouched &&
                    !hasError &&
                    "border-green-500 focus-visible:ring-green-500",
                  hasError && "border-red-500 focus-visible:ring-red-500",
                )}
              >
                <SelectTrigger data-testid={testId}>
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
