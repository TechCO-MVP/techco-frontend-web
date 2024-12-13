"use client";
import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import { Heading } from "../Typography/Heading";
import { OTPInstructionText } from "../OTPInstructionText/OTPInstructionText";
import { Text } from "../Typography/Text";
import { Button } from "../ui/button";

import { OTPFormInput } from "../OTPFormInput/OTPFormInput";
import { Dictionary } from "@/types/i18n";
import { getErrorMessage } from "@/lib/utils";
import { OTPFormData, OTPFormSchema } from "@/lib/schemas";

export function OTPForm({ dictionary }: { readonly dictionary: Dictionary }) {
  // fixed top-0 left-[50%] z-[100] flex max-h-screen w-full translate-x-[-50%] flex-col-reverse p-4 sm:right-0 sm:flex-col md:max-w-[420px]

  const { otpPage: i18n } = dictionary;
  const [resendBtnEnabled, _resendBtnEnabled] = useState(false);
  const form = useForm<OTPFormData>({
    mode: "onChange",
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      code: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = form;

  const onSubmit = async (data: OTPFormData) => {
    startTransition(async () => {
      console.log(data);
    });
  };
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-md bg-white px-8 py-6">
      {/* Top Section */}
      <div className="mb-10 flex flex-col items-center">
        <Heading
          level={1}
          className="mb-5 text-center text-2xl font-normal leading-8"
        >
          {i18n.formHeading}
        </Heading>
        <OTPInstructionText
          onExpire={() => _resendBtnEnabled(true)}
          dictionary={dictionary}
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex w-full max-w-md flex-col items-center"
        >
          <OTPFormInput
            testId="otp-code-input"
            pattern={REGEXP_ONLY_DIGITS}
            name="code"
            label={i18n.otpInputLabel}
            maxLength={4}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />
        </form>
      </Form>
      <div className="flex items-center">
        <Text size="small" className="text-gray-400">
          {i18n.otpTimeExpired}
        </Text>
        <Button variant="link" disabled={!resendBtnEnabled}>
          {i18n.otpResendCode}
        </Button>
      </div>
    </div>
  );
}
