import type { Meta, StoryObj } from "@storybook/react";

import { CreateUserDialog } from "@/components/CreateUserDialog/CreateUserDialog";

const meta: Meta<typeof CreateUserDialog> = {
  title: "Components/CreateUserDialog",
  component: CreateUserDialog,
  render: (args, { loaded: { dictionary } }) => (
    <CreateUserDialog {...args} dictionary={dictionary} />
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

type Story = StoryObj<typeof CreateUserDialog>;

export const Default: Story = {};
