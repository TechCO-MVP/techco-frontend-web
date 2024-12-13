import type { Meta, StoryObj, ReactRenderer } from "@storybook/react";
import type { PartialStoryFn as StoryFn } from "@storybook/types";
import SignUpPage from "@/app/[lang]/(auth)/signup/page";
import SignUpLayout from "@/app/[lang]/(auth)/layout";

const meta: Meta<typeof SignUpPage> = {
  title: "Pages/SignUpPage",
  component: SignUpPage,
  render: (args, { loaded: { params } }) => (
    <SignUpLayout params={params}>
      <SignUpPage {...args} params={params} />
    </SignUpLayout>
  ),
  parameters: {
    layout: "fullscreen",
  },
  decorators: [(Story: StoryFn<ReactRenderer>) => <Story />],
};

export default meta;

type Story = StoryObj<typeof SignUpPage>;

export const Default: Story = {};
