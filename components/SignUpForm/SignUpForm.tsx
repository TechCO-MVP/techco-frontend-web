"use client";
import { setAuthState } from "@/lib/store/features/auth/auth";
import { useAppDispatch } from "@/lib/store/hooks";
import { useState, useTransition } from "react";
import * as actions from "@/actions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema, SignUpFormData } from "@/lib/schemas";
import { FormInput } from "@/components/FormInput/FormInput";
import { FormSelect } from "@/components/FormSelect/FormSelect";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { FormCombobox } from "../FormCombobox/FormCombobox";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { COUNTRIES } from "@/lib/data/countries";
import { getErrorMessage } from "@/lib/utils";
import { Dictionary } from "@/types/i18n";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/paths";
import { Loader2 } from "lucide-react";

export function SignUpForm({
  dictionary,
}: {
  readonly dictionary: Dictionary;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signUp: i18n } = dictionary;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<SignUpFormData>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      full_name: "",
      email: "",
      company: "",
      country: "",
      companySize: "",
      role: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;

  const handleAuthError = (message?: string) => {
    setError(message || "Something went wrong. Please try again.");
  };

  const onSubmit = async (data: SignUpFormData) => {
    try {
      startTransition(async () => {
        const signUpResponse = await actions.signUp(data);

        if (!signUpResponse.success) {
          return handleAuthError(signUpResponse?.message);
        }

        const signInResponse = await actions.signIn(data);

        if (!signInResponse.session) {
          return handleAuthError(signInResponse?.message);
        }
        dispatch(
          setAuthState({
            email: data.email,
            session: signInResponse.session,
            company: data.company,
            companySize: data.companySize,
            country: data.country,
            role: data.role,
            firstSignIn: true,
          }),
        );
        router.push(paths.codeValidationSignUp());
      });
    } catch (error: unknown) {
      handleAuthError(
        error instanceof Error ? error.message : "Unexpected error occurred",
      );
    }
  };
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-2xl rounded-b-none border-b-[5px] border-b-talent-orange-500 bg-white px-8 py-14 shadow-talent-green">
      {/* Top Section */}
      <div className="mb-3 flex flex-col items-center">
        <Heading level={1} className="text-2xl leading-8 text-[#15342E]">
          {i18n.welcomeTitle}
        </Heading>
        <Text className="mb-4 leading-8 text-[#15342E]" type="p" size="large">
          {i18n.welcomeMessage}
        </Text>
        <Text
          className="text-[#15342E] text-muted-foreground"
          type="span"
          size="small"
        >
          {i18n.callToActionText}
        </Text>
      </div>
      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex w-full max-w-md flex-col items-center"
        >
          <div className="flex min-h-[20px] items-center">
            {error && (
              <Text size="small" type="span" className="m-0 text-red-500">
                {error}
              </Text>
            )}
          </div>
          {/* Form Row */}
          <FormInput
            classNames="mb-0"
            testId="signup-name-input"
            name="full_name"
            label={i18n.nameLabel}
            placeholder={i18n.namePlaceholder}
            type="string"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          {/* Form Row */}
          <FormInput
            classNames="mb-0"
            testId="signup-email-input"
            name="email"
            label={i18n.emailLabel}
            placeholder={i18n.emailPlaceholder}
            type="email"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          {/* Form Row */}
          <FormInput
            classNames="mb-0"
            testId="signup-company-input"
            name="company"
            label={i18n.companyLabel}
            placeholder={i18n.companyPlaceholder}
            type="string"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          {/* Form Row */}
          <FormCombobox
            classNames="mb-0"
            testId="country-select-trigger"
            name="country"
            label={i18n.countryLabel}
            placeholder={i18n.countryPlaceholder}
            searchPlaceholder={i18n.countrySearchPlaceholder}
            noResultsMessage={i18n.countryNotFound}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            options={COUNTRIES}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          {/* Form Row */}
          <FormSelect
            classNames="mb-0"
            testId="signup-company-select"
            name="companySize"
            label={i18n.companySizeLabel}
            placeholder={i18n.companySizePlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            options={[
              { value: "A", label: "Entre 1 y 10" },
              { value: "B", label: "Entre 11 y 50" },
              { value: "C", label: "Entre 50 y 200" },
              { value: "D", label: "Más de 200" },
            ]}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          {/* Form Row */}
          <FormSelect
            classNames="mb-0"
            testId="signup-role-select"
            name="role"
            label={i18n.companyRoleLabel}
            placeholder={i18n.companyRolePlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            options={[
              { value: "Talent Recruiter", label: "Talent Recruiter" },
              {
                value: "Talent Acquisition Specialist",
                label: "Talent Acquisition Specialist",
              },
              { value: "HR Consultant", label: "HR Consultant" },
              {
                value: "Talent Acquisition Manager",
                label: "Talent Acquisition Manager",
              },
            ]}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          <Button
            variant="talentGreen"
            data-testid="signup-submit-button"
            disabled={!isValid || isPending}
            type="submit"
            className="mx-auto mt-4 w-full max-w-[22rem] bg-talent-orange-500"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" /> {i18n.loadingMessage}
              </>
            ) : (
              i18n.createAccountLabel
            )}
          </Button>
        </form>
      </Form>
      <div className="flex max-w-[22rem] flex-col items-center justify-center">
        <Text type="p" size="small" className="text-muted-foreground">
          {i18n.termsMessage}
        </Text>
        <div className="text-sm text-muted-foreground">
          <Link className="underline" href="www.google.com">
            {i18n.termsOfService}
          </Link>
          {i18n.and}
          <Link className="underline" href="www.google.com">
            {i18n.privacyPolicy}
          </Link>
        </div>
      </div>
    </div>
  );
}
