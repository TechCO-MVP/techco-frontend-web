"use client";

import { Dictionary } from "@/types/i18n";
import { FC, useState, useTransition, useRef } from "react";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { Form } from "@/components/ui/form";
import { CreateBusinessSchema, CreateBusinessData } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
import { FormInput } from "@/components/FormInput/FormInput";
import { FormSelect } from "../FormSelect/FormSelect";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import * as actions from "@/actions";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useBusinesses } from "@/hooks/use-businesses";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { FormCombobox } from "../FormCombobox/FormCombobox";
import { COUNTRIES } from "@/lib/data/countries";
import { useAppDispatch } from "@/lib/store/hooks";
import { setSidebarState } from "@/lib/store/features/sidebar/sidebar";

type CreateBusinessDialogProps = {
  dictionary: Dictionary;
};

export const CreateBusinessDialog: FC<Readonly<CreateBusinessDialogProps>> = ({
  dictionary,
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const { rootBusiness } = useBusinesses();
  const { companiesPage: i18n } = dictionary;
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  const form = useForm<CreateBusinessData>({
    mode: "onChange",
    resolver: zodResolver(CreateBusinessSchema),
    defaultValues: {
      parentBusinessId: rootBusiness?._id,
      name: "",
      companySize: "",
      country: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;
  console.log({ isValid, isPending });
  const onSubmit = async (data: CreateBusinessData) => {
    try {
      startTransition(async () => {
        const createBusinessResponse = await actions.createCompanyAction(data);
        if (createBusinessResponse.success) {
          setOpen(false);
          toast({ description: i18n.createSucessMessage });
          queryClient.invalidateQueries({ queryKey: QUERIES.COMPANY_LIST });
          dispatch(
            setSidebarState({
              isOpen: true,
            }),
          );
        } else {
          setError(createBusinessResponse.message);
        }
      });
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      setError(errorMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button asChild variant="ghost" className="bg-secondary">
          <span>
            <Plus /> {i18n.createBusinessButtonLabel}
          </span>
        </Button>
      </DialogTrigger>

      <DialogTitle className="hidden">
        {i18n.createBusinessFormTitle}
      </DialogTitle>

      <DialogContent className="overflow-y-auto">
        <div className="flex w-full max-w-[26rem] flex-col items-center justify-center rounded-md bg-white p-12">
          {/* Top Section */}
          <div className="mb-5 flex flex-col items-center">
            <Heading
              level={1}
              className="mb-5 text-center text-2xl font-normal leading-8"
            >
              {i18n.createBusinessFormTitle}
            </Heading>
          </div>
          {/* Form */}
          <Form {...form}>
            <form
              ref={formRef}
              onSubmit={handleSubmit(onSubmit)}
              className="mb-4 flex w-full max-w-md flex-col items-center"
            >
              {/* Form Row */}
              <FormInput
                testId="create-company-input"
                name="name"
                label={i18n.companyNameLabel}
                placeholder={i18n.companyNamePlaceholder}
                type="text"
                control={control}
                errors={errors}
                dirtyFields={dirtyFields}
                getErrorMessage={getErrorMessage(dictionary)}
              />

              {/* Form Row */}
              <FormCombobox
                containerRef={formRef}
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
              <div className="flex min-h-[20px] items-center">
                {error && (
                  <Text
                    size="small"
                    type="span"
                    className="m-0 mb-3 text-red-500"
                  >
                    {error}
                  </Text>
                )}
              </div>
              <Button
                data-testid="create-user-submit-button"
                disabled={!isValid || isPending}
                type="submit"
                className="mx-auto mb-4 w-full max-w-[22rem]"
              >
                {isPending ? (
                  <>
                    <Loader2 className="animate-spin" /> {i18n.loadingMessage}
                  </>
                ) : (
                  i18n.continueBtnText
                )}
              </Button>
              <DialogClose asChild>
                <Button
                  variant="ghost"
                  data-testid="create-user-cancel-button"
                  type="button"
                  className="mx-auto w-full max-w-[22rem]"
                >
                  {i18n.cancelBtnText}
                </Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
