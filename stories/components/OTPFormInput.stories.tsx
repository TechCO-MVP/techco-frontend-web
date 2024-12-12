import type { Meta, StoryObj, Decorator, StoryContext } from "@storybook/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { OTPFormInput } from "@/components/OTPFormInput/OTPFormInput";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { userEvent, within } from "@storybook/test";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const withFormDecorator: Decorator = (Story, context: StoryContext) => {
  const schema = z.object({
    code: z.string().min(4, { message: "Invalid code" }),
  });
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { code: "" },
    mode: "onChange",
    resolver: zodResolver(schema),
  });
  const {
    control,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = form;

  const onSubmit: SubmitHandler<z.infer<typeof schema>> = (data) => {
    alert(`Submitted: ${JSON.stringify(data)}`);
  };

  const getErrorMessage = (message?: string) =>
    message ? message : "Unknown error.";

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Story
          args={{
            testId: "otp-input",
            getErrorMessage,
            control,
            errors: errors,
            dirtyFields,
            name: context.args.name,
            label: context.args.label,
            placeholder: context.args.placeholder,
          }}
        />
        <Button className="hidden">Submit</Button>
      </form>
    </Form>
  );
};

const meta: Meta<typeof OTPFormInput> = {
  title: "Components/OTPFormInput",
  component: OTPFormInput,
  decorators: [withFormDecorator],
  parameters: {
    docs: {
      description: {
        component:
          "The `OTPFormInput` component integrates with `react-hook-form` and supports error validation and dynamic styles.",
      },
    },
  },
};

export default meta;

// Stories

export const Default: StoryObj<typeof OTPFormInput> = {
  args: {
    name: "code",
    label: "Enter OTP Code",
  },
};

export const WithError: StoryObj<typeof OTPFormInput> = {
  args: {
    name: "code",
    label: "Enter OTP Code",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText(/submit/i);
    await button.click();
  },
};

export const Completed: StoryObj<typeof OTPFormInput> = {
  args: {
    name: "code",
    label: "Enter OTP Code",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByTestId("otp-input");
    await userEvent.type(input, "3101", { delay: 100 });
  },
};
