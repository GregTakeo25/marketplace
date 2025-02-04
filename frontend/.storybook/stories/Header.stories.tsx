import { RoutePaths } from "src/App";
import { withRouter } from "storybook-addon-react-router-v6";

import Header from "src/App/Layout/Header/View";
import { responsiveChromatic } from "src/test/utils";
import { UserIdentityDocument } from "src/__generated/graphql";
import withMockedProvider from "../decorators/withMockedProvider";
import withAuthProvider from "../decorators/withAuthProvider";
import withContributorProfilePanelProvider from "../decorators/withContributorProfilePanelProvider";

const USER_ID = "e2ee731a-2697-4306-bf4b-c807f6fda0d7";

const mocks = [
  {
    request: {
      query: UserIdentityDocument,
      variables: { userId: USER_ID },
    },
    result: {
      data: {
        userInfo: [
          {
            identity: {
              Person: {
                lastname: "Bar",
                firstname: "Foo",
              },
            },
          },
        ],
      },
    },
  },
];

export default {
  title: "Header",
  component: Header,
  parameters: responsiveChromatic,
  decorators: [withRouter, withMockedProvider(mocks), withAuthProvider(), withContributorProfilePanelProvider],
};

const args = {
  menuItems: {
    [RoutePaths.Projects]: "Projects",
    [RoutePaths.Rewards]: "Rewards",
  },
  isLoggedIn: false,
  selectedMenuItem: RoutePaths.Projects,
  impersonating: false,
};

export const Default = {
  render: () => <Header {...args} />,

  parameters: { layout: "fullscreen", backgrounds: { default: "space" } },
};
