import type { Meta, StoryObj } from "@storybook/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormInput } from "@/components/FormInput/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const meta: Meta<typeof FormInput> = {
  title: "Components/FormInput",
  component: FormInput,
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

type Story = StoryObj<typeof FormInput>;

type FormSchema = {
  email: string;
};

export const Default: Story = {
  render: () => {
    const form = useForm<FormSchema>({
      defaultValues: { email: "" },
      mode: "onBlur",
    });

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
    } = form;

    const onSubmit: SubmitHandler<FormSchema> = (data) => {
      alert(`Submitted: ${JSON.stringify(data)}`);
    };

    const getErrorMessage = (key?: string) =>
      key ? `The field ${key} is invalid.` : "Unknown error.";

    return (
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const WithError: Story = {
  render: () => {
    const form = useForm<FormSchema>({
      defaultValues: { email: "" },
      mode: "onBlur",
    });

    const {
      control,
      setError,
      formState: { errors, dirtyFields },
    } = form;

    const getErrorMessage = (key?: string) =>
      key ? `The field ${key} is required.` : "Unknown error.";

    return (
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError("email", {
              type: "manual",
              message: "Invalid email address",
            });
          }}
        >
          <FormInput
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const Filled: Story = {
  render: () => {
    const form = useForm<FormSchema>({
      defaultValues: { email: "test@example.com" },
      mode: "onBlur",
    });

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
    } = form;

    const onSubmit: SubmitHandler<FormSchema> = (data) => {
      alert(`Submitted: ${JSON.stringify(data)}`);
    };

    const getErrorMessage = (key?: string) =>
      key ? `The field ${key} is required.` : "Unknown error.";

    return (
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormInput
            name="email"
            label="Email Address"
            placeholder="Enter your email"
            type="email"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    );
  },
};

export const Focus: Story = {
  render: () => {
    const form = useForm<FormSchema>({
      defaultValues: { email: "" },
      mode: "onBlur",
    });

    const {
      control,
      handleSubmit,
      formState: { errors, dirtyFields },
    } = form;

    const getErrorMessage = (key?: string) =>
      key ? `The field ${key} is required.` : "Unknown error.";

    return (
      <Form {...form}>
        <form onSubmit={handleSubmit(() => {})}>
          <FormInput
            name="email"
            label="Email Address"
            placeholder="Focus the input"
            type="email"
            control={control}
            errors={errors}
            dirtyFields={dirtyFields}
            getErrorMessage={getErrorMessage}
          />
        </form>
      </Form>
    );
  },
};
