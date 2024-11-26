import type { Meta, StoryObj } from "@storybook/react";
import IndexPage from "@/app/[lang]/page";

const meta: Meta<typeof IndexPage> = {
  title: "Pages/IndexPage",
  component: IndexPage,
  render: (args, { loaded: { params } }) => (
    <IndexPage {...args} params={params} />
  ),
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof IndexPage>;

export const Default: Story = {};
