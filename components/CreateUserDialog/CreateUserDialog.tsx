"use client";

import { Dictionary } from "@/types/i18n";
import { FC, useEffect, useState, useTransition } from "react";
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
import { Laugh, Plus, SmilePlus } from "lucide-react";
import * as actions from "@/actions";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { QUERIES } from "@/constants/queries";
import { OptionCard } from "../OptionCard/OptionCard";
import { Search } from "./Search";
import { Business, User, UserRole } from "@/types";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ROLES } from "@/constants";

type CreateUserDialogProps = {
  dictionary: Dictionary;
  users: User[];
  business?: Business;
};

export const CreateUserDialog: FC<Readonly<CreateUserDialogProps>> = ({
  business,
  dictionary,
  users,
}) => {
  const [mode, setMode] = useState<"new" | "existing">();
  const [role, setRole] = useState<UserRole["role"]>();
  const [existingUser, setExistingUser] = useState<User>();
  const { toast } = useToast();
  const { userSettingsPage: i18n } = dictionary;
  const [error, setError] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<CreateUserData>({
    mode: "onChange",
    resolver: zodResolver(CreateUserSchema),
    defaultValues: {
      businessId: business?._id,
      email: "",
      fullName: "",
      businessName: business?.name || "",
      companyPosition: "",
      role: "",
    },
  });
  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;

  useEffect(() => {
    if (mode !== "new" && users.length === 0) setMode("new");
  }, [users, mode]);
  const onSubmit = async (data: CreateUserData) => {
    try {
      startTransition(async () => {
        const createUserResponse = await actions.createUser(data);

        if (createUserResponse.success) {
          setOpen(false);
          toast({ description: i18n.createSucessMessage });
          queryClient.invalidateQueries({
            queryKey: QUERIES.USER_LIST(business?._id),
          });
        } else {
          setError(createUserResponse.message);
        }
      });
    } catch (error: unknown) {
      console.log(error);
      const errorMessage =
        error instanceof Error ? error.message : "Unexpected error occurred";
      setError(errorMessage);
    }
  };

  const onUpdateUser = async () => {
    if (!existingUser || !role || !business) return;
    if (
      !existingUser.roles.some(
        (r) => r.business_id === business._id && r.role === role,
      )
    ) {
      existingUser.roles.push({
        business_id: business._id,
        role,
      });
    }

    try {
      startTransition(async () => {
        const updateUserReponse = await actions.updateUser({
          businessId: business._id,
          businessName: business.name,
          companyPosition: existingUser.company_position,
          email: existingUser.email,
          fullName: existingUser.full_name,
          id: existingUser._id,
          role: existingUser.role || role,
          roles: existingUser.roles,
        });
        if (updateUserReponse.success) {
          setOpen(false);
          toast({ description: i18n.createSucessMessage });
          queryClient.invalidateQueries({
            queryKey: QUERIES.USER_LIST(business?._id),
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
  useEffect(() => {
    if (!open) {
      setExistingUser(undefined);
      setMode(undefined);
      setRole(undefined);
      form.reset();
    }
  }, [open, form]);

  const getTitle = () => {
    switch (mode) {
      case "new":
        return i18n.createUserFormTitle;
      case "existing":
        return i18n.selectModeTitle;
      default:
        return i18n.assignUserFormTitle;
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "new":
        return i18n.newModeDescription;
      case "existing":
        return i18n.selectModeDescription;
      default:
        return i18n.assignUserFormDescription;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button asChild variant="ghost" className="h-8 bg-secondary">
          <span>
            <Plus /> {i18n.createUserButtonLabel}
          </span>
        </Button>
      </DialogTrigger>

      <DialogTitle className="hidden">{i18n.assignUserFormTitle}</DialogTitle>

      <DialogContent className="max-h-[36rem] max-w-fit overflow-y-auto !rounded-none xl:max-h-none">
        <div className="flex w-full flex-col items-center justify-center bg-white p-8">
          {mode !== undefined && users.length > 0 && (
            <Button
              className="mb-10 place-self-start"
              variant="outline"
              onClick={() => setMode(undefined)}
            >
              {i18n.goBack}
            </Button>
          )}
          {/* Top Section */}
          <div className="mb-5 flex flex-col items-center">
            <Heading
              level={1}
              className="mb-5 text-center text-2xl font-normal leading-8"
            >
              {getTitle()}
            </Heading>
            <Text className="text-muted-foreground" type="span" size="small">
              {getDescription()}
            </Text>
          </div>
          {!mode && (
            <div className="flex gap-6">
              <OptionCard
                title={i18n.newUserTitle}
                description={i18n.newUserDescription}
                selectBtnLabel={i18n.newUserLabel}
                onClick={() => setMode("new")}
                icon={<SmilePlus className="h-10 w-10 text-muted-foreground" />}
              />

              <OptionCard
                title={i18n.existingUserTitle}
                description={i18n.existingUserDescription}
                selectBtnLabel={i18n.existingUserLabel}
                onClick={() => setMode("existing")}
                icon={<Laugh className="h-10 w-10 text-muted-foreground" />}
              />
            </div>
          )}
          {mode === "existing" && (
            <div className="flex flex-col gap-10">
              <Search
                setExistingUser={setExistingUser}
                placeholder={i18n.searchPlaceholder}
                users={users}
              />

              <Select
                name="role"
                disabled={isPending}
                onValueChange={(value: UserRole["role"]) => {
                  setRole(value);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Seleccione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {ROLES.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                data-testid="create-user-submit-button"
                disabled={!existingUser || !role || isPending}
                type="button"
                onClick={() => onUpdateUser()}
                className="mx-auto w-full max-w-[22rem]"
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
            </div>
          )}
          {/* Form */}
          {mode === "new" && (
            <Form {...form}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mb-4 flex w-full max-w-md flex-col items-center"
              >
                {/* Form Row */}
                <FormInput
                  classNames="mb-0"
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
                  classNames="mb-0"
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
                  classNames="mb-0"
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
                  classNames="mb-0"
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
                  classNames="mb-0"
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
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
