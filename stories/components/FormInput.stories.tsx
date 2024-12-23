import type { Meta, StoryObj, Decorator, StoryContext } from "@storybook/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from "@/components/FormInput/FormInput";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { userEvent, within } from "@storybook/test";
import { zodResolver } from "@hookform/resolvers/zod";

const withFormDecorator: Decorator = (Story, context: StoryContext) => {
  const schema = z.object({
    email: z.string().email({ message: "Invalid Email" }),
  });
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { email: "" },
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
            getErrorMessage,
            control,
            errors: errors,
            dirtyFields,
            name: context.args.name,
            label: context.args.label,
            placeholder: context.args.placeholder,
          }}
        />
      </form>
    </Form>
  );
};

const meta: Meta<typeof FormInput> = {
  title: "Components/FormInput",
  component: FormInput,
  decorators: [withFormDecorator],
  parameters: {
    docs: {
      description: {
        component:
          "The `FormInput` component integrates with `react-hook-form` and supports error validation and dynamic styles.",
      },
    },
  },
};

export default meta;

// Stories

export const Default: StoryObj<typeof FormInput> = {
  args: {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
  },
};

export const WithError: StoryObj<typeof FormInput> = {
  args: {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter your email");
    await userEvent.type(input, "company.com", { delay: 100 });
  },
};

export const Completed: StoryObj<typeof FormInput> = {
  args: {
    name: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter your email");
    await userEvent.type(input, "company@mail.com", { delay: 100 });
  },
};
