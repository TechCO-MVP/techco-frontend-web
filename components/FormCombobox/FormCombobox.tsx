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
import { Text } from "@/components/Typography/Text";
import { cn } from "@/lib/utils";

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
          <FormItem className="mx-auto mb-3 w-full max-w-xs">
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
                <PopoverContent className="w-[250px] p-0">
                  <Command>
                    <CommandInput placeholder={searchPlaceholder} />
                    <CommandList>
                      <CommandEmpty>{noResultsMessage}</CommandEmpty>
                      <CommandGroup>
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
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
