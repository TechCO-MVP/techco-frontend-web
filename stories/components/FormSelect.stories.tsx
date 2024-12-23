import type { Meta, StoryObj, Decorator, StoryContext } from "@storybook/react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FormSelect } from "@/components/FormSelect/FormSelect";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { userEvent, within } from "@storybook/test";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

const withFormDecorator: Decorator = (Story, context: StoryContext) => {
  const schema = z.object({
    country: z.string().min(3, { message: "Invalid Country" }),
  });
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: { country: "" },
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
            testId: "country-select",
            getErrorMessage,
            control,
            errors: errors,
            dirtyFields,
            options: context.args.options ?? [
              { value: "united-states", label: "United States" },
              { value: "spain", label: "Spain" },
              { value: "germany", label: "Germany" },
            ],
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

const meta: Meta<typeof FormSelect> = {
  title: "Components/FormSelect",
  component: FormSelect,
  decorators: [withFormDecorator],
  parameters: {
    docs: {
      description: {
        component:
          "The `FormSelect` component integrates with `react-hook-form` and supports error validation and dynamic styles.",
      },
    },
  },
};

export default meta;

// Stories

export const Default: StoryObj<typeof FormSelect> = {
  args: {
    name: "country",
    placeholder: "Select a Country",
    label: "Country",
  },
};

export const WithError: StoryObj<typeof FormSelect> = {
  args: {
    name: "country",
    placeholder: "Select a Country",
    label: "Country",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByText(/submit/i);
    await button.click();
  },
};

export const Completed: StoryObj<typeof FormSelect> = {
  args: {
    name: "country",
    placeholder: "Select a Country",
    label: "Country",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Click the select button
    const select = canvas.getByRole("combobox", { name: /country/i });
    await userEvent.click(select);

    await userEvent.keyboard("{Enter}");
  },
};
