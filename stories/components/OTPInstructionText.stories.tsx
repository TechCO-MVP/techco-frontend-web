import type { Meta, StoryObj } from "@storybook/react";
import { OTPInstructionText } from "@/components/OTPInstructionText/OTPInstructionText";

const meta: Meta<typeof OTPInstructionText> = {
  title: "Components/OTPInstructionText",
  component: OTPInstructionText,
  render: (args, { loaded: { dictionary } }) => (
    <OTPInstructionText {...args} dictionary={dictionary} />
  ),
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof OTPInstructionText>;

export const Default: Story = {};
