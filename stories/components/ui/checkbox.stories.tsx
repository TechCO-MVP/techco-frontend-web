import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@/components/ui/checkbox";
import { userEvent, within } from "@storybook/test";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component:
          "The `Checkbox` component from `shadcn/ui`, supporting checked, unchecked, and disabled states.",
      },
    },
  },
  argTypes: {
    disabled: {
      control: "boolean",
      description: "Disables the checkbox.",
    },
    defaultChecked: {
      control: "boolean",
      description: "Controls the default checked state.",
    },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

// Default Checkbox
export const Default: Story = {
  args: {
    id: "terms",
  },
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox {...args} data-testid="checkbox" />
      <label
        htmlFor="terms"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Accept terms and conditions
      </label>
    </div>
  ),
};

// Checked State
export const Checked: Story = {
  args: {
    id: "terms",
    defaultChecked: true,
  },
  render: Default.render,
};

// Disabled State
export const Disabled: Story = {
  args: {
    id: "terms",
    disabled: true,
  },
  render: Default.render,
};

// Play Function Example
export const WithFocus: Story = {
  args: {
    id: "terms",
  },
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByTestId("checkbox");
    await userEvent.click(checkbox);
  },
};
