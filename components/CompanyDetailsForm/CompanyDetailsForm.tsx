"use client";
import { FC, useTransition, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { Dictionary } from "@/types/i18n";
import { Heading } from "../Typography/Heading";
import { Text } from "../Typography/Text";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { CompanyDetailsData, CompanyDetailsSchema } from "@/lib/schemas";
import { FormInput } from "../FormInput/FormInput";
import { FormTextarea } from "../FormTextarea/FormTextarea";
import { countryLabelLookup, getErrorMessage, formatDate } from "@/lib/utils";
import { Button } from "../ui/button";
import { updateCompanyAction } from "@/actions/companies/update";
import { CountryLabel } from "../CountryLabel/CountryLabel";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Business } from "@/types";
import { FormSelect } from "../FormSelect/FormSelect";
import { Loader2 } from "lucide-react";
import { FileDropzone } from "../FileDropzone/FileDropzone";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { QUERIES } from "@/constants/queries";
import { CreateBusinessDialog } from "../CreateBusinessDialog/CreateBusinessDialog";
import { useParams } from "next/navigation";
import { Locale } from "@/i18n-config";
import { useUsers } from "@/hooks/use-users";
import { useCurrentUser } from "@/hooks/use-current-user";
import { FormCombobox } from "../FormCombobox/FormCombobox";
import { COUNTRIES } from "@/lib/data/countries";
type CompanyDetailsFormProps = {
  dictionary: Dictionary;
  businesses: Business[];
};

// Helper to get company initials
function getCompanyInitials(name?: string) {
  if (!name) return "UN";
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export const CompanyDetailsForm: FC<Readonly<CompanyDetailsFormProps>> = ({
  dictionary,
  businesses,
}) => {
  const params = useParams<{ lang: Locale; id: string }>();
  const { id } = params;
  const selectedCompany = useMemo(() => {
    return businesses.find((business) => business._id === id);
  }, [id, businesses]);

  const { users } = useUsers({
    businessId: selectedCompany?._id,
  });
  const { currentUser } = useCurrentUser();

  const localUser = useMemo(() => {
    return users.find((user) => user.email === currentUser?.email);
  }, [users, currentUser]);

  const userRole = useMemo(() => {
    return localUser?.roles.find((role) => role.business_id === id);
  }, [localUser, id]);

  const [error, setError] = useState<string | undefined>("");
  const [logo, setLogo] = useState(selectedCompany?.logo);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { companiesPage: i18n } = dictionary;

  const form = useForm<CompanyDetailsData>({
    mode: "onChange",
    resolver: zodResolver(CompanyDetailsSchema),
    defaultValues: {
      description: selectedCompany?.description || "",
      website: selectedCompany?.url || "",
      linkedin: selectedCompany?.linkedin_url || "",
      companySize: selectedCompany?.company_size,
      industry: selectedCompany?.industry || "",
      segment: selectedCompany?.segment || "",
      name: selectedCompany?.name,
      countryCode: selectedCompany?.country_code,
    },
  });
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;

  const getCountryLabel = () => {
    if (!selectedCompany?.country_code) return null;
    const label = countryLabelLookup(
      selectedCompany?.country_code?.toLocaleLowerCase(),
    );
    return label;
  };
  const onSubmit = async (data: CompanyDetailsData) => {
    if (!selectedCompany) return;
    try {
      startTransition(async () => {
        const updateResponse = await updateCompanyAction(
          { ...data, logo: logo || selectedCompany?.logo },
          selectedCompany._id,
        );
        if (updateResponse.success) {
          toast({ description: i18n.updateSucess });
          queryClient.invalidateQueries({ queryKey: QUERIES.COMPANY_LIST });
        } else {
          setError(updateResponse.message);
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
        <div className="flex w-full justify-between">
          <div className="flex flex-col items-start">
            <Heading
              level={1}
              className="text-center text-2xl font-normal leading-8"
            >
              {i18n.formTitle}
            </Heading>
            <Text className="text-muted-foreground" type="span" size="small">
              {i18n.formDescription}
            </Text>
          </div>
          {userRole?.role === "super_admin" && (
            <CreateBusinessDialog dictionary={dictionary} />
          )}
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <div className="flex flex-col">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {getCompanyInitials(selectedCompany?.name)}
              </AvatarFallback>
            </Avatar>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger>
                <Button asChild variant="ghost">
                  <span>{i18n.editLogoLabel}</span>
                </Button>
              </DialogTrigger>

              <DialogTitle className="hidden">Upload Image</DialogTitle>

              <DialogContent className="max-h-[36rem] overflow-y-auto xl:max-h-none">
                <FileDropzone
                  dragImageLabel={i18n.dragImageLabel}
                  selectImageLabel={i18n.selectImageLabel}
                  onImageProcessed={(value) => {
                    setLogo(value);
                    setOpen(false);
                  }}
                />
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    data-testid="create-user-cancel-button"
                    type="button"
                    className="mx-auto"
                  >
                    {i18n.closeButtonLabel}
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <Text fontWeight="bold">{selectedCompany?.name}</Text>
              <CountryLabel label={getCountryLabel()} />
            </div>
            <Text className="text-muted-foreground">
              {formatDate(selectedCompany?.created_at)}
            </Text>
          </div>
        </div>
      </div>
      {/* Form */}
      <Form {...form}>
        <form
          id="company-details-form"
          onSubmit={handleSubmit(onSubmit)}
          className="mb-4 flex w-full flex-col pb-24"
        >
          {/* Error Message */}
          <div className="flex min-h-[20px] items-center">
            {error && (
              <Text size="small" type="span" className="m-0 text-red-500">
                {error}
              </Text>
            )}
          </div>

          <FormInput
            classNames="max-w-full"
            testId="company-name-input"
            name="name"
            label={i18n.nameLabel}
            placeholder={i18n.namePlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage(dictionary)}
          />

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

          <FormCombobox
            classNames="max-w-full"
            testId="country-select-trigger"
            name="countryCode"
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
            classNames="max-w-full"
            testId="company-size-select"
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
            classNames="max-w-full"
            testId="company-industry-select"
            name="industry"
            label={i18n.companyIndustryLabel}
            placeholder={i18n.companyIndustryPlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            options={[
              { value: "Fintech", label: "Fintech" },
              { value: "Healthcare", label: "Healthcare" },
              {
                value: "Education",
                label: "Education",
              },
              {
                value: "E-commerce",
                label: "E-commerce",
              },
              { value: "Real Estate", label: "Real Estate" },
              {
                value: "Technology",
                label: "Technology",
              },
              { value: "Manufacturing", label: "Manufacturing" },
            ]}
            getErrorMessage={getErrorMessage(dictionary)}
          />
          {/* Form Row */}
          <FormSelect
            classNames="max-w-full"
            testId="company-segment-select"
            name="segment"
            label={i18n.companySegmentLabel}
            placeholder={i18n.companySegmentPlaceholder}
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            options={[
              { value: "Empresa Pública", label: "Empresa Pública" },
              { value: "Autónomo", label: "Autónomo" },
              {
                value: "Organismo gubernamental",
                label: "Organismo gubernamental",
              },
              {
                value: "Organización sin ánimo de lucro",
                label: "Organización sin ánimo de lucro",
              },
              { value: "Empresa individual", label: "Empresa individual" },
              {
                value: "De financiación privada",
                label: "De financiación privada",
              },
              { value: "Asociación", label: "Asociación" },
            ]}
            getErrorMessage={getErrorMessage(dictionary)}
          />
        </form>
      </Form>

      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-end border-t border-gray-200 bg-white px-8 py-4 shadow-lg">
        <Button
          variant="talentGreen"
          disabled={
            !isValid || isPending || Object.keys(dirtyFields).length === 0
          }
          type="submit"
          form="company-details-form"
          className="w-full max-w-40"
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin" /> {i18n.loadingMessage}
            </>
          ) : (
            i18n.submitButton
          )}
        </Button>
      </div>
    </div>
  );
};
