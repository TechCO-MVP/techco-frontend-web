import type { Meta, StoryObj } from "@storybook/react";

import { SignUpForm } from "@/components/SignUpForm/SignUpForm";

const meta: Meta<typeof SignUpForm> = {
  title: "Components/SignUpForm",
  component: SignUpForm,
  render: (args, { loaded: { dictionary } }) => (
    <SignUpForm {...args} dictionary={dictionary} />
  ),
  parameters: {
    layout: "centered",
    design: {
      type: "figspec",
      url: "https://www.figma.com/design/vK1TDQJRm1caluullnxHo6/Untitled?node-id=1000-1151&t=MpPhDkiwHQai64tv-4",
    },
  },
};

export default meta;

type Story = StoryObj<typeof SignUpForm>;

export const Default: Story = {};
