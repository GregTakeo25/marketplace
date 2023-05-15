import { InMemoryCache } from "@apollo/client";
import { uniqBy } from "lodash";

export default function useApolloCache() {
  return new InMemoryCache({
    typePolicies: {
      AuthGithubUsers: {
        keyFields: ["userId"],
      },
      ProjectDetails: {
        keyFields: ["projectId"],
      },
      ProjectGithubRepos: {
        keyFields: ["projectId", "githubRepoId"],
      },
      ProjectLeads: {
        keyFields: ["userId", "projectId"],
      },
      UserInfo: {
        keyFields: ["userId"],
      },
      WorkItems: {
        keyFields: ["paymentId", "repoId", "issueNumber"],
      },
      IgnoredGithubIssues: {
        keyFields: ["projectId", "repoId", "issueNumber"],
      },
      Budgets: {
        fields: {
          paymentRequests: {
            merge: (existing = [], incoming) => uniqBy([...existing, ...incoming], "__ref"),
          },
        },
      },
      GithubIssues: {
        fields: {
          ignoredForProjects: {
            //   merge: (existing = [], incoming) => uniqBy([...existing, ...incoming], "__ref"),
          },
        },
      },
      PaymentRequests: {
        fields: {
          workItems: {
            merge: (_, incoming) => incoming,
          },
        },
      },
    },
  });
}