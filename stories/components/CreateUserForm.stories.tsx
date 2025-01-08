import type { Meta, StoryObj } from "@storybook/react";

import { CreateUserForm } from "@/components/CreateUserDialog/CreateUserDialog";

const meta: Meta<typeof CreateUserForm> = {
  title: "Components/CreateUserForm",
  component: CreateUserForm,
  render: (args, { loaded: { dictionary } }) => (
    <CreateUserForm {...args} dictionary={dictionary} />
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

type Story = StoryObj<typeof CreateUserForm>;

export const Default: Story = {};
