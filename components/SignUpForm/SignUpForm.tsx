"use client";
import { useTransition } from "react";
import * as actions from "@/actions";
import { VALIDATION_ERROR_KEYS } from "@/constants";
import { getDictionary } from "@/get-dictionary";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormSchema, SignUpFormData } from "@/lib/schemas";
import { FormInput } from "../FormInput/FormInput";
import { FormSelect } from "../FormSelect/FormSelect";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { FormCombobox } from "../FormCombobox/FormCombobox";
import Link from "next/link";
import { Button } from "../ui/button";
import { COUNTRIES } from "@/lib/data/countries";
import { Form } from "../ui/form";
export function SignUpForm({
  dictionary,
}: {
  readonly dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  const { signUp: i18n } = dictionary;
  const [isPending, startTransition] = useTransition();

  function getErrorMessage(key?: string): string {
    return dictionary.validationErrors[
      VALIDATION_ERROR_KEYS[key as keyof typeof VALIDATION_ERROR_KEYS]
    ];
  }

  const form = useForm<SignUpFormData>({
    mode: "onChange",
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
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

  const onSubmit = async (data: SignUpFormData) => {
    startTransition(async () => {
      const response = await actions.signUp(data);
      console.log(response);
    });
  };
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-md bg-white px-8 py-6">
      {/* Top Section */}
      <div className="mb-10 flex flex-col items-center">
        <Heading level={1} className="text-2xl leading-8">
          {i18n.welcomeTitle}
        </Heading>
        <Text className="mb-4 leading-8" type="p" size="large">
          {i18n.welcomeMessage}
        </Text>
        <Text className="text-gray-400" type="span" size="small">
          {i18n.callToActionText}
        </Text>
      </div>
      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex w-full max-w-md flex-col items-center"
        >
          {/* Form Row */}
          <FormInput
            name="email"
            label={i18n.emailLabel}
            placeholder={i18n.emailPlaceholder}
            type="email"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage}
          />
          {/* Form Row */}
          <FormInput
            name="company"
            label={i18n.companyLabel}
            placeholder={i18n.companyPlaceholder}
            type="string"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage}
          />
          {/* Form Row */}
          <FormCombobox
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
            getErrorMessage={getErrorMessage}
          />
          {/* Form Row */}
          <FormSelect
            name="companySize"
            label={i18n.companySizeLabel}
            placeholder={i18n.companySizePlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            options={[
              { value: "Entre 1 y 10", label: "Entre 1 y 10" },
              { value: "Entre 11 y 50", label: "Entre 11 y 50" },
              { value: "Entre 50 y 200", label: "Entre 50 y 200" },
              { value: "Más de 200", label: "Más de 200" },
            ]}
            getErrorMessage={getErrorMessage}
          />
          {/* Form Row */}
          <FormSelect
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
            getErrorMessage={getErrorMessage}
          />
          <Button
            disabled={!isValid}
            type="submit"
            className="mx-auto w-full max-w-[22rem]"
          >
            {i18n.createAccountLabel}
            {isPending && `...`}
          </Button>
        </form>
      </Form>
      <div className="flex max-w-[22rem] flex-col items-center justify-center">
        <Text type="p" size="small" className="text-gray-400">
          {i18n.termsMessage}
        </Text>
        <div className="text-sm text-gray-400">
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
