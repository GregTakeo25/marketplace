import { ComponentStory, ComponentMeta } from "@storybook/react";
import CompletePaymentInformationButton from "src/pages/MyContributions/CompletePaymentInformationButton";

import InfoMissingBanner from ".";

export default {
  title: "InfoMissingBanner",
  component: InfoMissingBanner,
} as ComponentMeta<typeof InfoMissingBanner>;

const Template: ComponentStory<typeof InfoMissingBanner> = args => <InfoMissingBanner {...args} />;

export const Default = Template.bind({});

Default.args = {}; // put your component's args for the Default story here

export const WithButton = Template.bind({});

WithButton.args = {
  children: (
    <CompletePaymentInformationButton>
      <div>Complete payment information</div>
    </CompletePaymentInformationButton>
  ),
}; // put your component's args for the Default story here