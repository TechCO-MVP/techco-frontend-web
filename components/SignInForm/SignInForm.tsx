"use client";
import { useState, useTransition } from "react";
import * as actions from "@/actions";
import { Dictionary } from "@/types/i18n";
import { FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heading } from "@/components/Typography/Heading";
import { Text } from "@/components/Typography/Text";
import { SignInFormSchema, SignUpFormData } from "@/lib/schemas";
import { Form } from "@/components/ui/form";
import { getErrorMessage } from "@/lib/utils";
import { FormInput } from "@/components/FormInput/FormInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { paths } from "@/lib/paths";
import { setAuthState } from "@/lib/store/features/auth/auth";
import { useAppDispatch } from "@/lib/store/hooks";
type SignInFormProps = {
  dictionary: Dictionary;
};
export const SignInForm: FC<Readonly<SignInFormProps>> = ({ dictionary }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { signIn: i18n } = dictionary;
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const form = useForm<SignUpFormData>({
    mode: "onChange",
    resolver: zodResolver(SignInFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const {
    control,
    handleSubmit,
    formState: { dirtyFields, errors, isValid },
  } = form;

  const onSubmit = async (data: SignUpFormData) => {
    startTransition(async () => {
      const signInResponse = await actions.signIn(data);
      if (!signInResponse.session) {
        return setError(signInResponse.message);
      }
      dispatch(
        setAuthState({ email: data.email, session: signInResponse.session }),
      );
      router.push(paths.codeValidation());
    });
  };
  return (
    <div className="flex w-full max-w-xl flex-col items-center justify-center rounded-md bg-white px-8 py-6">
      {/* Top Section */}
      <div className="mb-5 flex flex-col items-center">
        <Heading
          level={1}
          className="mb-5 text-center text-2xl font-normal leading-8"
        >
          {i18n.formTitle}
        </Heading>
        <Text className="text-muted-foreground" type="span" size="small">
          {i18n.formDescription}
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
          <Button
            disabled={!isValid}
            type="submit"
            className="mx-auto w-full max-w-[22rem]"
          >
            {i18n.continueBtnText}
            {isPending && `...`}
          </Button>
        </form>
      </Form>
      <div className="flex items-center">
        <Text size="small" className="text-muted-foreground">
          {i18n.noAccountText}
        </Text>
        <Link href="signup">
          <Button variant="link">{i18n.createAccountLabel}</Button>
        </Link>
      </div>
    </div>
  );
};
