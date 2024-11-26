import type { Meta, StoryObj } from "@storybook/react";
import Counter from "@/components/Counter";

const meta: Meta<typeof Counter> = {
  title: "Components/Counter",
  component: Counter,
  parameters: {
    layout: "centered",
  },
  render: (args, { loaded: { dictionary } }) => (
    <Counter {...args} dictionary={dictionary} />
  ),
};

export default meta;

type Story = StoryObj<typeof Counter>;

export const Default: Story = {};
