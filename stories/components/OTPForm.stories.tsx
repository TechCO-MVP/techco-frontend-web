import type { Meta, StoryObj } from "@storybook/react";

import { OTPForm } from "@/components/OTPForm/OTPForm";

const meta: Meta<typeof OTPForm> = {
  title: "Components/OTPForm",
  component: OTPForm,
  render: (args, { loaded: { dictionary } }) => (
    <OTPForm {...args} dictionary={dictionary} />
  ),
  parameters: {
    layout: "centered",
    design: {
      type: "figspec",
      url: "https://www.figma.com/design/vK1TDQJRm1caluullnxHo6/Untitled?node-id=915-725&t=MpPhDkiwHQai64tv-4",
    },
  },
};

export default meta;

type Story = StoryObj<typeof OTPForm>;

export const Default: Story = {};
