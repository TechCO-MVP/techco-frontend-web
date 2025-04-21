"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import {
  Control,
  FieldErrors,
  Path,
  UseFormStateReturn,
  FieldValues,
} from "react-hook-form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type FormComboboxProps<TSchema extends FieldValues> = {
  name: Path<TSchema>;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  noResultsMessage: string;
  testId: string;
  control: Control<TSchema>;
  errors: FieldErrors<TSchema>;
  dirtyFields: UseFormStateReturn<TSchema>["dirtyFields"];
  options: { label: string; value: string }[];
  getErrorMessage: (key?: string) => string;
  containerRef?: React.RefObject<HTMLFormElement | null>;
  classNames?: string;
};

export function FormCombobox<TSchema extends FieldValues>({
  name,
  label,
  placeholder,
  searchPlaceholder,
  noResultsMessage,
  control,
  errors,
  dirtyFields,
  options,
  getErrorMessage,
  testId,
  containerRef,
  classNames,
}: FormComboboxProps<TSchema>) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const selected = options.find((o) => o.value === field.value);
        const isTouched = !!dirtyFields[name as keyof typeof dirtyFields];
        const hasError = !!errors[name];

        return (
          <FormItem className={cn("mx-auto mb-3 w-full max-w-xs", classNames)}>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    data-testid={testId}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "focus-visible:ring-talent-orange-500",
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                      isTouched &&
                        !hasError &&
                        "border-green-500 focus-visible:ring-green-500",
                      hasError && "border-red-500 focus-visible:ring-red-500",
                    )}
                  >
                    {selected ? (
                      <div className="flex items-center gap-2">
                        {selected.label}
                      </div>
                    ) : (
                      placeholder
                    )}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-[250px] p-0"
                  containerRef={containerRef}
                >
                  <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList className="max-h-[150px]">
                      <CommandEmpty>{noResultsMessage}</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={`${option.value}-${option.label}`}
                            value={option.value}
                            onSelect={() => {
                              field.onChange(option.value);
                              setOpen(false);
                            }}
                          >
                            <div className="flex items-center gap-2">
                              {option.label}
                            </div>
                            <Check
                              className={cn(
                                "ml-auto",
                                field.value === option.value
                                  ? "opacity-100"
                                  : "opacity-0",
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
