"use client";

import { Dictionary } from "@/types/i18n";
import { FC, useState, useTransition } from "react";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { Form } from "@/components/ui/form";
import { CreateUserData, CreateUserSchema } from "@/lib/schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getErrorMessage } from "@/lib/utils";
import { FormInput } from "@/components/FormInput/FormInput";
import { FormSelect } from "../FormSelect/FormSelect";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";

type CreateUserDialogProps = {
  dictionary: Dictionary;
};

export const CreateUserDialog: FC<Readonly<CreateUserDialogProps>> = ({
  dictionary,
}) => {
  const { userSettingsPage: i18n } = dictionary;
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateUserData>({
    mode: "onChange",
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      email: "",
      name: "",
      company: "",
      position: "",
      role: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;
  const onSubmit = async (data: CreateUserData) => {
    console.log("submit", data);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button asChild variant="ghost" className="bg-secondary">
          <span>
            <Plus /> Crear Usuario
          </span>
        </Button>
      </DialogTrigger>

      <DialogTitle className="hidden">{i18n.createUserFormTitle}</DialogTitle>

      <DialogContent className="max-h-[36rem] overflow-y-auto xl:max-h-none">
        <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-md bg-white px-8 py-6">
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
              <div className="flex min-h-[20px] items-center">
                {error && (
                  <Text size="small" type="span" className="m-0 text-red-500">
                    {error}
                  </Text>
                )}
              </div>
              {/* Form Row */}
              <FormInput
                testId="create-user-company-input"
                name="company"
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
                name="name"
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
                name="position"
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
                data-testid="create-user-submit-button"
                disabled={!isValid}
                type="submit"
                className="mx-auto mb-4 w-full max-w-[22rem]"
              >
                {i18n.continueBtnText}
                {isPending && `...`}
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
