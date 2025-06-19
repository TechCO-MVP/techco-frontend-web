import type { Meta, StoryObj } from "@storybook/react";
import { UserMenu } from "@/components/UserMenu/UserMenu";

const meta: Meta<typeof UserMenu> = {
  title: "Components/UserMenu",
  component: UserMenu,
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Default: Story = {};
