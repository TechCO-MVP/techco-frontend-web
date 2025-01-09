"use client";
import { useTransition, useState, useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useAppSelector } from "@/lib/store/hooks";
import * as actions from "@/actions";
import { Heading } from "../Typography/Heading";
import { OTPInstructionText } from "../OTPInstructionText/OTPInstructionText";
import { Text } from "../Typography/Text";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { OTPFormInput } from "../OTPFormInput/OTPFormInput";
import { Dictionary } from "@/types/i18n";
import { getErrorMessage } from "@/lib/utils";
import { OTPFormData, OTPFormSchema } from "@/lib/schemas";
import { paths } from "@/lib/paths";
import { setAuthState } from "@/lib/store/features/auth/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { Loader2 } from "lucide-react";
export function OTPSignUpForm({
  dictionary,
}: {
  readonly dictionary: Dictionary;
}) {
  const dispatch = useAppDispatch();

  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [error, setError] = useState<string | undefined>("");
  const router = useRouter();
  const authState = useAppSelector((state) => state.auth);
  const [key, setKey] = useState(0);

  const formRef = useRef<HTMLFormElement>(null);
  const { otpPage: i18n } = dictionary;
  const [resendBtnEnabled, _resendBtnEnabled] = useState(false);
  const form = useForm<OTPFormData>({
    mode: "onChange",
    resolver: zodResolver(OTPFormSchema),
    defaultValues: {
      code: "",
      session: authState.session,
      email: authState.email,
    },
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, dirtyFields },
  } = form;
  const code = useWatch({ control, name: "code" });

  const onSubmit = async (data: OTPFormData) => {
    startTransition(async () => {
      setError(undefined);
      const response = await actions.verifyCodeSignUp({
        ...data,
        company: authState.company,
        companySize: authState.companySize,
        country: authState.country,
        role: authState.role,
      });
      if (!response.success) {
        return setError(response.message);
      }
      router.push(paths.home());
    });
  };

  const resendCode = async () => {
    if (!authState.email) return;
    setError("");
    setValue("code", "");
    setKey((prev) => prev + 1);
    const signInResponse = await actions.signIn({
      email: authState.email,
    });
    if (!signInResponse.session) {
      return setError(signInResponse.message);
    }
    setValue("session", signInResponse.session);
    dispatch(setAuthState({ session: signInResponse.session }));
    toast({
      description: i18n.otpNewCodeMessage,
    });
  };

  useEffect(() => {
    if (code.length === 6) {
      formRef.current?.requestSubmit();
    }
  }, [code, authState.email, router]);
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
          key={key}
          onExpire={() => _resendBtnEnabled(true)}
          dictionary={dictionary}
        />
      </div>
      <Form {...form}>
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="mb-2 flex w-full max-w-md flex-col items-center"
        >
          <OTPFormInput
            disabled={isPending}
            testId="otp-code-input"
            pattern={REGEXP_ONLY_DIGITS}
            name="code"
            label={i18n.otpInputLabel}
            maxLength={6}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          <div className="flex min-h-[20px] items-center">
            {error && (
              <Text size="small" type="span" className="m-0 text-red-500">
                {error}
              </Text>
            )}
            {isPending && (
              <Text
                size="small"
                className="flex items-center justify-center gap-2 text-muted-foreground"
              >
                <Loader2 className="animate-spin" /> {i18n.loadingMessage}
              </Text>
            )}
          </div>
        </form>
      </Form>
      <div className="flex items-center">
        <Text size="small" className="text-muted-foreground">
          {i18n.otpTimeExpired}
        </Text>
        <Button
          onClick={resendCode}
          variant="link"
          disabled={!resendBtnEnabled}
        >
          {i18n.otpResendCode}
        </Button>
      </div>
    </div>
  );
}
