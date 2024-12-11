import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import { userEvent, within } from "@storybook/test";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
  argTypes: {
    className: {
      control: "text",
      description: "Additional Tailwind CSS classes",
    },
    type: {
      control: "text",
      description: "The input type (e.g., text, email, password)",
      defaultValue: "text",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the input",
    },
    disabled: {
      control: "boolean",
      description: "Disables the input field",
    },
    value: {
      control: "text",
      description: "The current input value",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "The `Input` component from `shadcn/ui` is a styled input element supporting various states and customizations using Tailwind CSS.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

// Default: Empty Input
export const Empty: Story = {
  args: {
    placeholder: "Enter text here...",
  },
};

// Disabled Input
export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

// Input with Value
export const WithValue: Story = {
  args: {
    placeholder: "Enter text here...",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Enter text here...");
    await userEvent.type(input, "Pre-filled value", { delay: 100 });
  },
};

// With Error Simulation
export const WithError: Story = {
  args: {
    placeholder: "Input with error",
    className: "border-red-500 focus-visible:ring-red-500",
  },
};

// Focus Style Simulation
export const Focus: Story = {
  args: {
    placeholder: "Focus style preview",
    className: "focus-visible:ring-offset-0 ",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByPlaceholderText("Focus style preview");
    await userEvent.click(input);
  },
};
