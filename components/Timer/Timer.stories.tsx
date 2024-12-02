import type { Meta, StoryObj } from "@storybook/react";
import { Timer } from "./Timer";

const meta: Meta<typeof Timer> = {
  title: "Components/Timer",
  component: Timer,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    duration: {
      description: "Time in seconds",
      options: [5, 30, 60, 90],
      control: {
        type: "select",
      },
    },
    onExpire: {
      type: "function",
      description: "Callback to be executed when the timer expires",
    },
  },
  args: {
    duration: 5,
    onExpire: () => console.log("Time expired!"),
  },
};

export default meta;

type Story = StoryObj<typeof Timer>;

export const Default: Story = {};
