"use client";

import { Dictionary } from "@/types/i18n";
import { Dispatch, FC, SetStateAction, useState, useTransition } from "react";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { Form } from "@/components/ui/form";
import { UpdateUserData, CreateUserSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
import { FormInput } from "@/components/FormInput/FormInput";
import { FormSelect } from "../FormSelect/FormSelect";
import { Button } from "@/components/ui/button";
import * as actions from "@/actions";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useBusinesses } from "@/hooks/use-businesses";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { User } from "@/types";

type EditUserDialogProps = {
  dictionary: Dictionary;
  user: User;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditUserDialog: FC<Readonly<EditUserDialogProps>> = ({
  user,
  dictionary,
  open,
  setOpen,
}) => {
  const { toast } = useToast();
  const { rootBusiness } = useBusinesses();
  const { userSettingsPage: i18n } = dictionary;
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const queryClient = useQueryClient();
  const form = useForm<UpdateUserData>({
    mode: "onChange",
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      businessId: rootBusiness?._id,
      email: user.email,
      fullName: user.full_name,
      businessName: rootBusiness?.name || "",
      companyPosition: user.company_position,
      role: user.role,
    },
  });
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;

  const onSubmit = async (data: UpdateUserData) => {
    try {
      console.log("submit", data);
      startTransition(async () => {
        const updateUserReponse = await actions.updateUser({
          ...data,
          id: user._id,
        });

        if (updateUserReponse.success) {
          setOpen(false);
          toast({ description: i18n.createSucessMessage });
          queryClient.invalidateQueries({
            queryKey: QUERIES.USER_LIST(rootBusiness?._id),
          });
        } else {
          setError(updateUserReponse.message);
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
      <DialogTitle className="hidden">{i18n.createUserFormTitle}</DialogTitle>

      <DialogContent className="max-h-[36rem] overflow-y-auto xl:max-h-none">
        <div className="flex w-full max-w-[26rem] flex-col items-center justify-center rounded-md bg-white p-12">
          {/* Top Section */}
          <div className="mb-5 flex flex-col items-center">
            <Heading
              level={1}
              className="mb-5 text-center text-2xl font-normal leading-8"
            >
              {i18n.createUserFormTitle}
            </Heading>
            <Text className="text-muted-foreground" type="span" size="small">
              {i18n.createUserFormDescription}
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
                disabled={true}
                testId="create-user-company-input"
                name="businessName"
                label={i18n.companyLabel}
                placeholder={i18n.companyPlaceholder}
                type="text"
                control={control}
                errors={errors}
                dirtyFields={dirtyFields}
                getErrorMessage={getErrorMessage(dictionary)}
              />
              {/* Form Row */}
              <FormInput
                testId="create-user-name-input"
                name="fullName"
                label={i18n.nameLabel}
                placeholder={i18n.namePlaceholder}
                type="text"
                control={control}
                errors={errors}
                dirtyFields={dirtyFields}
                getErrorMessage={getErrorMessage(dictionary)}
              />
              {/* Form Row */}
              <FormInput
                testId="create-user-email-input"
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
                testId="create-user-position-input"
                name="companyPosition"
                label={i18n.positionLabel}
                placeholder={i18n.positionPlaceholder}
                type="text"
                control={control}
                errors={errors}
                dirtyFields={dirtyFields}
                getErrorMessage={getErrorMessage(dictionary)}
              />
              {/* Form Row */}
              <FormSelect
                testId="create-user-role-select"
                name="role"
                label={i18n.roleLabel}
                placeholder={i18n.rolePlaceholder}
                control={control}
                errors={errors}
                dirtyFields={dirtyFields}
                options={[
                  { value: "super_admin", label: "Super Admin" },
                  { value: "business_admin", label: "Business Admin" },
                  { value: "position_owner", label: "Position Owner" },
                  { value: "recruiter", label: "Recruiter" },
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
                onClick={() =>
                  console.log("btn click", onSubmit(form.getValues()))
                }
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
                  i18n.updateUserBtnText
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
