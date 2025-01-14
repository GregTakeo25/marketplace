import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { waitFor } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import {
  GetUserPayoutSettingsDocument,
  GetUserPayoutSettingsQueryResult,
  UserPayoutSettingsFragment,
} from "src/__generated/graphql";
import usePayoutSettings from "./usePayoutSettings";
import { PropsWithChildren } from "react";
import { ToasterProvider } from "./useToaster";

const GITHUB_USER_ID = 12345;

type WrapperProps = {
  mocks?: ReadonlyArray<MockedResponse>;
} & PropsWithChildren;

const wrapper = ({ children, mocks }: WrapperProps) => (
  <ToasterProvider>
    <MockedProvider mocks={mocks}>{children}</MockedProvider>
  </ToasterProvider>
);

const render = (mocks: MockedResponse[]) =>
  renderHook(() => usePayoutSettings(GITHUB_USER_ID), { wrapper, initialProps: { mocks } });

const mockGetPayoutSettingsQuery = <T, I>(payoutSettings: T, arePayoutSettingsValid: boolean, identity?: I) => ({
  request: {
    query: GetUserPayoutSettingsDocument,
    variables: { githubUserId: GITHUB_USER_ID },
  },
  result: {
    data: {
      registeredUsers: [
        {
          userPayoutInfo: {
            __typename: "UserPayoutInfo",
            identity,
            payoutSettings,
            arePayoutSettingsValid,
          } as UserPayoutSettingsFragment,
        },
      ],
    } as GetUserPayoutSettingsQueryResult["data"],
  },
});

export type PayoutSettings = {
  EthTransfer?: {
    Address?: string;
    Name?: string;
  };
  WireTransfer?: {
    IBAN?: string;
    BIC?: string;
  };
};

describe("usePayoutSettings", () => {
  test.each([
    [{ EthTransfer: { Address: "0xdef735b26faf007d34c5161581bbdcb3844c92e6b35e66e457dfd04742021127" } }, true],
    [{ EthTransfer: { Name: "vitalik.eth" } }, true],
    [{ WireTransfer: { IBAN: "FR0614508000708483648722R33", BIC: "AGFBFRCC" } }, true],
    [{}, false],
    [null, false],
    [{ EthTransfer: {} }, false],
    [{ EthTransfer: { Name: null } }, false],
    [{ EthTransfer: { Address: null } }, false],
    [{ WireTransfer: {} }, false],
    [{ WireTransfer: { IBAN: null, BIC: null } }, false],
    [{ WireTransfer: { IBAN: null, BIC: "AGFBFRCC" } }, false],
    [{ WireTransfer: { IBAN: "FR0614508000708483648722R33", BIC: null } }, false],
  ])("should return payout settings and their validity", async (payoutSettings, arePayoutSettingsValid) => {
    const { result } = render([mockGetPayoutSettingsQuery(payoutSettings, arePayoutSettingsValid)]);
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.valid).toBe(arePayoutSettingsValid);
    expect(result.current.data?.payoutSettings).toEqual(payoutSettings);
    expect(result.current.invoiceNeeded).toBe(false);
  });

  it("should return whether the user is registered as a company", async () => {
    const { result } = render([mockGetPayoutSettingsQuery(null, false, { Company: { name: "MyCompany" } })]);
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.invoiceNeeded).toBe(true);
  });
});
