"use client";
import { FC, useTransition, useState } from "react";

import { Dictionary } from "@/types/i18n";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CompanyDetailsData, CompanyDetailsSchema } from "@/lib/schemas";
import { FormInput } from "../FormInput/FormInput";
import { FormTextarea } from "../FormTextarea/FormTextarea";
import { getErrorMessage } from "@/lib/utils";
import { Button } from "../ui/button";
import { updateCompanyAction } from "@/actions/companies/update";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
type CompanyDetailsFormProps = {
  dictionary: Dictionary;
};

export const CompanyDetailsForm: FC<Readonly<CompanyDetailsFormProps>> = ({
  dictionary,
}) => {
  const [error, setError] = useState<string | undefined>("");

  const [isPending, startTransition] = useTransition();
  const { companiesPage: i18n } = dictionary;
  const form = useForm<CompanyDetailsData>({
    mode: "onChange",
    resolver: zodResolver(CompanyDetailsSchema),
    defaultValues: {
      description: "",
      website: "",
      linkedin: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;
  const onSubmit = async (data: CompanyDetailsData) => {
    try {
      startTransition(async () => {
        const updateResponse = await updateCompanyAction(data);
        if (updateResponse.success) {
          console.log("Updated!");
        }
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unexpected error occurred";
      setError(message || "Something went wrong. Please try again.");
    }
  };
  return (
    <div className="flex w-full flex-col px-8 py-6">
      {/* Top Section */}

      <div className="mb-5 flex flex-col items-start">
        <Heading
          level={1}
          className="text-center text-2xl font-normal leading-8"
        >
          {i18n.formTitle}
        </Heading>
        <Text className="text-muted-foreground" type="span" size="small">
          {i18n.formDescription}
        </Text>
        <div className="mt-6 flex items-center justify-center gap-6">
          <div>
            <Avatar className="h-20 w-20">
              <AvatarImage
                src="https://picsum.photos/200/200"
                alt="@username"
              />
              <AvatarFallback>UN</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Text fontWeight="bold">Casa&Cosecha  S.A</Text>
              <CountryLabel label="🇪🇸 Spain" />
            </div>
            <Text className="text-muted-foreground">
              Creado por: Mao Molina | 17 Feb 2023
            </Text>
          </div>
        </div>
      </div>
      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex w-full flex-col"
        >
          {/* Error Message */}
          <div className="flex min-h-[20px] items-center">
            {error && (
              <Text size="small" type="span" className="m-0 text-red-500">
                {error}
              </Text>
            )}
          </div>
          <FormTextarea
            classNames="max-w-full"
            testId="company-description-input"
            name="description"
            label={i18n.descriptionLabel}
            placeholder={i18n.descriptionPlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />

          <FormInput
            classNames="max-w-full"
            testId="company-website-input"
            description={i18n.websiteDescription}
            name="website"
            label={i18n.websiteLabel}
            placeholder={i18n.websitePlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />

          <FormInput
            classNames="max-w-full"
            testId="company-linkedin-input"
            name="linkedin"
            label={i18n.linkedinLabel}
            placeholder={i18n.linkedinPlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />

          {/* Submit Button */}
          <Button disabled={!isValid} type="submit" className="w-full max-w-40">
            {i18n.submitButton}
            {isPending && `...`}
          </Button>
        </form>
      </Form>
    </div>
  );
};
