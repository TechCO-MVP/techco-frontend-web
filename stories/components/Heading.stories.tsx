import { Meta, StoryObj } from "@storybook/react";
import { Heading } from "@/components/Typography/Heading";

const meta: Meta<typeof Heading> = {
  title: "Typography/Heading",
  component: Heading,
  argTypes: {
    level: {
      control: {
        type: "select",
        options: [1, 2, 3, 4],
      },
      description: "The heading level (h1-h4)",
      defaultValue: 1,
    },
    children: {
      control: "text",
      description: "The text to display inside the heading",
      defaultValue: "Sample Heading Text",
    },
    className: {
      control: "text",
      description: "Additional CSS classes",
      defaultValue: "",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "The `Heading` component is used for typography and supports dynamic heading levels (h1-h4) with customizable styles using Tailwind CSS.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Default: Story = {
  args: {
    level: 1,
    children: "This is a Heading",
  },
};

export const Level2: Story = {
  args: {
    level: 2,
    children: "This is an H2 Heading",
  },
};

export const CustomStyles: Story = {
  args: {
    level: 3,
    children: "Custom Styled Heading",
    className: "text-red-500 underline",
  },
};
