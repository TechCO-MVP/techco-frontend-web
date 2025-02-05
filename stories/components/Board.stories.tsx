import type { Meta, StoryObj } from "@storybook/react";
import { Board } from "@/components/Board/Board";

const meta: Meta<typeof Board> = {
  title: "Components/Board",
  component: Board,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Board>;

export const Default: Story = {};
