"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { getDictionary } from "@/get-dictionary";
import { Heading } from "../Typography/Heading";
import { OTPInstructionText } from "../OTPInstructionText/OTPInstructionText";
import { Text } from "../Typography/Text";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
});

export function OTPForm({
  dictionary,
}: {
  readonly dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const pathname = usePathname();
  console.log(pathname);
  const { otpPage: i18n } = dictionary;
  const [resendBtnEnabled, _resendBtnEnabled] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  });

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
        <form className="mb-4 flex w-full max-w-md flex-col items-center">
          <FormItem>
            <FormLabel>{i18n.otpInputLabel}</FormLabel>
            <FormControl>
              <InputOTP maxLength={4} pattern={REGEXP_ONLY_DIGITS}>
                <InputOTPGroup className="mr-4">
                  <InputOTPSlot index={0} />
                </InputOTPGroup>
                <InputOTPGroup className="mr-4">
                  <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPGroup className="mr-4">
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                </InputOTPGroup>
              </InputOTP>
            </FormControl>
          </FormItem>
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
