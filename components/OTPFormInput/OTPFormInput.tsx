"use client";

import {
  Control,
  FieldErrors,
  Path,
  UseFormStateReturn,
  FieldValues,
} from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Text } from "@/components/Typography/Text";
import { cn } from "@/lib/utils";

type FormOTPInputProps<TSchema extends FieldValues> = {
  name: Path<TSchema>;
  label: string;
  testId: string;
  maxLength?: number;
  disabled?: boolean;
  pattern?: string;
  description?: string;
  control: Control<TSchema>;
  errors: FieldErrors<TSchema>;
  dirtyFields: UseFormStateReturn<TSchema>["dirtyFields"];
  getErrorMessage: (key?: string) => string;
};

export function OTPFormInput<TSchema extends FieldValues>({
  name,
  label,
  testId,
  maxLength = 6,
  pattern,
  description,
  control,
  errors,
  dirtyFields,
  getErrorMessage,
  disabled,
}: FormOTPInputProps<TSchema>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const isTouched = !!dirtyFields[name as keyof typeof dirtyFields];
        const hasError = !!errors[name];
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <InputOTP
                disabled={disabled}
                data-testid={testId}
                maxLength={maxLength}
                pattern={pattern}
                {...field}
              >
                {Array.from({ length: maxLength }, (_, i) => (
                  <InputOTPGroup key={i} className={cn("mr-4")}>
                    <InputOTPSlot
                      className={cn(
                        isTouched &&
                          !hasError &&
                          "border-green-500 ring-green-500",
                        hasError && "border-red-500 bg-red-100 ring-red-500",
                      )}
                      key={i}
                      index={i}
                    />
                  </InputOTPGroup>
                ))}
              </InputOTP>
            </FormControl>

            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}

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
