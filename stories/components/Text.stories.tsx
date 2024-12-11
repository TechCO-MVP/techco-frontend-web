import { Meta, StoryObj } from "@storybook/react";
import { Text } from "@/components/Typography/Text";

const meta: Meta<typeof Text> = {
  title: "Typography/Text",
  component: Text,
  argTypes: {
    size: {
      control: {
        type: "select",
        options: ["normal", "small", "xs", "xxs"],
      },
      description: "The font size of the text",
      defaultValue: "normal",
    },
    fontWeight: {
      control: {
        type: "select",
        options: ["regular", "medium", "bold", "black"],
      },
      description: "The font weight of the text",
      defaultValue: "regular",
    },
    type: {
      control: {
        type: "select",
        options: ["span", "p", "label", "figcaption"],
      },
      description: "The HTML element to render",
      defaultValue: "p",
    },
    color: {
      control: "color",
      description: "Text color using a CSS color or Tailwind class",
    },
    children: {
      control: "text",
      description: "The content inside the text component",
      defaultValue: "Sample text content",
    },
    className: {
      control: "text",
      description: "Additional CSS classes for customization",
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          "The `Text` component provides flexible typography for various text elements, supporting different sizes, font weights, and customizable colors.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    size: "normal",
    fontWeight: "regular",
    type: "p",
    children: "This is normal text.",
  },
};

export const CustomFontWeight: Story = {
  args: {
    size: "normal",
    fontWeight: "bold",
    type: "p",
    children: "Bold Text Example",
  },
};

export const SmallText: Story = {
  args: {
    size: "small",
    fontWeight: "medium",
    type: "span",
    children: "This is small text.",
  },
};

export const CustomColor: Story = {
  args: {
    size: "xs",
    fontWeight: "regular",
    type: "label",
    children: "Text with Custom Color",
    className: "text-green-500",
  },
};

export const CustomClassName: Story = {
  args: {
    size: "xxs",
    fontWeight: "black",
    type: "figcaption",
    className: "italic underline",
    children: "Styled with Custom Class",
  },
};
