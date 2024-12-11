import type { Meta, StoryObj, ReactRenderer } from "@storybook/react";
import type { PartialStoryFn as StoryFn } from "@storybook/types";
import OTPPage from "@/app/[lang]/signup/code/page";
import SignUpLayout from "@/app/[lang]/signup/layout";

const meta: Meta<typeof OTPPage> = {
  title: "Pages/OTPPage",
  component: OTPPage,
  render: (args, { loaded: { params } }) => (
    <SignUpLayout params={params}>
      <OTPPage {...args} params={params} />
    </SignUpLayout>
  ),
  parameters: {
    layout: "fullscreen",
  },
  decorators: [(Story: StoryFn<ReactRenderer>) => <Story />],
};

export default meta;

type Story = StoryObj<typeof OTPPage>;

export const Default: Story = {};
