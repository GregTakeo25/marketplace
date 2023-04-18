import { Page, expect, Locator } from "@playwright/test";
import { Project, User } from "../../types";
import { sortBy } from "lodash";

export class ProjectPaymentsPage {
  readonly page: Page;
  readonly project: Project;
  readonly url: string;

  constructor(page: Page, project: Project) {
    this.page = page;
    this.project = project;
    this.url = `/projects/${project.id}/payments`;
  }

  goto = () => this.page.goto(this.url);

  remainingBudget = () => this.page.locator("#remainingBudget").textContent();

  paymentList = () => new PaymentTable(this.page.locator("#payment_table"));

  newPayment = async () => {
    await this.page.getByText("New payment").click();
    await expect(this.page).toHaveURL(`${this.url}/new`);
    return new NewPaymentPage(this.page);
  };

  sidePanel = () => this.page.getByRole("dialog");
}

export class NewPaymentPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  requestPayment = async ({
    recipient,
    pullRequestIndexes = [],
    otherPullRequests = [],
    issuesIndexes = [],
    otherIssues = [],
    otherWorks = [],
  }: {
    recipient?: User;
    pullRequestIndexes?: number[];
    otherPullRequests?: string[];
    issuesIndexes?: number[];
    otherIssues?: string[];
    otherWorks?: {
      kind?: "documentation" | "meeting" | "subscription" | "other";
      title?: string;
      description: string;
      repository?: string;
    }[];
  }) => {
    // Set recipient
    if (recipient) {
      await this.page.getByText("Search by Github handle").click();
      await this.page.getByTestId("contributor-selection-input").fill(recipient.github.login);
      await this.page.getByRole("listitem").first().click();
    }

    // Add work items
    await this.page.getByTestId("add-work-item-btn").click();

    // Select PR in list
    const elligiblePulls = this.page.getByTestId("elligible-pulls").getByRole("button");
    for (const index of pullRequestIndexes.sort().reverse()) {
      await elligiblePulls.nth(index).click();
    }

    // Add other PR
    if (otherPullRequests.length > 0) {
      await this.page.locator("[data-testid=add-other-pr-toggle]").click();

      for (const pr of otherPullRequests) {
        await this.page.locator("#otherPrLink").fill(pr);
        await this.page.getByTestId("add-other-pr-btn").click();
        await expect(this.page.getByText(`#${pr.split("/").at(-1)}`)).toBeVisible();
      }
    }

    // Add issues
    if (issuesIndexes.length + otherIssues.length > 0) {
      await this.page.getByTestId("tab-issues").click();

      // Select issues in list
      const elligibleIssues = this.page.getByTestId("elligible-issues").getByRole("button");
      for (const index of sortBy(issuesIndexes).reverse()) {
        await elligibleIssues.nth(index).click();
      }

      // Add other issues
      if (otherIssues.length > 0) {
        await this.page.locator("[data-testid=add-other-issue-toggle]").click();

        for (const issue of otherIssues) {
          await this.page.locator("#otherIssueLink").fill(issue);
          await this.page.getByTestId("add-other-issue-btn").click();
          await expect(this.page.getByText(`#${issue.split("/").at(-1)}`)).toBeVisible();
        }
      }
    }

    // Add other work
    if (otherWorks.length > 0) {
      await this.page.getByTestId("tab-other-work").click();

      for (const otherWork of otherWorks) {
        const addedWorkItemsCount = await this.page
          .getByTestId("added-work-items")
          .locator("div[id^=github-issue-]")
          .count();

        otherWork.kind && (await this.page.getByRole("option", { name: otherWork.kind }).click());
        otherWork.title && (await this.page.getByTestId("other-work-title").fill(otherWork.title));
        await this.page.getByTestId("other-work-description").fill(otherWork.description);
        if (otherWork.repository) {
          await this.page.getByTestId("select-repo-button").click();
          await this.page.getByTestId("select-repo-options").locator("div", { hasText: otherWork.repository }).click();
        }
        await this.page.getByRole("button", { name: "create and add issue" }).click();

        await expect(this.page.getByTestId("added-work-items").locator("div[id^=github-issue-]")).toHaveCount(
          addedWorkItemsCount + 1
        );
      }
    }

    // Close panel and submit payment request
    await this.page.getByTestId("close-add-work-item-panel-btn").click();
    await this.page.getByText("Confirm payment").click();
  };

  contributorText = () => this.page.getByTestId("contributor-selection-value").textContent();
}

export class PaymentTable {
  readonly table: Locator;

  constructor(table: Locator) {
    this.table = table;
  }

  nth = (index: number) => new PaymentLine(this.table.getByRole("row").nth(index));
}

export class PaymentLine {
  readonly row: Locator;

  constructor(row: Locator) {
    this.row = row;
  }

  paymentId = () => this.row.getAttribute("data-payment-id");
  status = () => this.row.getByRole("cell").nth(3).locator("div").nth(1).textContent();
  click = () => this.row.click();
}