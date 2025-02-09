import type { Meta, StoryObj } from "@storybook/react";
import { UserCard } from "@/components/UserCard/UserCard";

const meta: Meta<typeof UserCard> = {
  title: "Components/UserCard",
  component: UserCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof UserCard>;

export const Default: Story = {};
