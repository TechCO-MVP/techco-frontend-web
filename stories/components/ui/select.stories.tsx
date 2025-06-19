import { Meta, StoryObj } from "@storybook/react";
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userEvent, within } from "@storybook/test";

const meta: Meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    docs: {
      description: {
        component:
          "The `Select` component from `shadcn/ui` allows selecting options from a dropdown.",
      },
    },
  },
};

export default meta;

type Story = StoryObj;

// Select Template
const Template = (args: { disabled?: boolean }) => (
  <Select disabled={args.disabled}>
    <SelectTrigger className="w-[180px]" data-testid="select-trigger">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes">Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
);

// Default Select
export const Default: Story = {
  render: Template,
  args: {},
};

// Disabled Select
export const Disabled: Story = {
  render: Template,
  args: {
    disabled: true,
  },
};

// Opened Select with Play Function
export const Opened: Story = {
  render: Template,
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByTestId("select-trigger");
    await userEvent.click(trigger); // Opens the dropdown
  },
};
