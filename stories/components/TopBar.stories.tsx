import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "@/components/TopBar/TopBar";

const meta: Meta<typeof TopBar> = {
  title: "Components/TopBar",
  component: TopBar,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const Default: Story = {};
