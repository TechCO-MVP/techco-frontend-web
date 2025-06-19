import React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof InputOTP> = {
  title: "Components/InputOTP",
  component: InputOTP,
  argTypes: {
    maxLength: { control: { type: "number" }, defaultValue: 6 },
  },
  args: {
    maxLength: 4,
  },
};

export default meta;
type Story = StoryObj<typeof InputOTP>;

export const Default: Story = {
  render: (args) => (
    <InputOTP maxLength={args.maxLength}>
      <InputOTPGroup>
        <InputOTPSlot index={0} />
      </InputOTPGroup>
      <InputOTPGroup>
        <InputOTPSlot index={1} />
      </InputOTPGroup>
      <InputOTPGroup>
        <InputOTPSlot index={2} />
      </InputOTPGroup>
      <InputOTPGroup>
        <InputOTPSlot index={3} />
      </InputOTPGroup>
    </InputOTP>
  ),
};
