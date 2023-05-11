import { ProjectFixture } from "../../types";

export const projects: Record<string, ProjectFixture> = {
  Kakarot: {
    name: "Kakarot",
    shortDescription: "EVM interpreter written in Cairo, a sort of ZK-EVM emulator, leveraging STARK proof system.",
    longDescription:
      "Kakarot is an Ethereum Virtual Machine written in Cairo. It means it can be deployed on StarkNet, a layer 2 scaling solution for Ethereum, and run any EVM bytecode program. Hence, Kakarot can be used to run Ethereum smart contracts on StarkNet. Kakarot is the super sayajin zkEVM! Why? Because: It's over 9000!!!!!.",
    telegramLink: "https://t.me/kakarot",
    logoUrl: "https://github.com/sayajin-labs/kakarot/raw/main/docs/img/kakarot_github_banner.png",
    initialBudget: 50000,
    pendingLeaderInvitations: ["Anthony", "Oscar"],
    leaders: ["TokioRs", "Olivier"],
    repos: ["kakarot"],
    sponsors: ["StarkNet"],
  },
  ProjectA: {
    name: "Project A with a really really long name",
    shortDescription: "A",
    longDescription: "AAA",
    telegramLink: "https://t.me/a",
    logoUrl: "https://avatars.githubusercontent.com/u/121887739?s=400&v=4",
    initialBudget: 100000,
    leaders: ["TokioRs"],
    repos: ["A", "B"],
    sponsors: ["StarkNet"],
  },
  ProjectB: {
    name: "Project B",
    shortDescription: "B",
    longDescription: "BBB",
    telegramLink: "https://t.me/b",
    logoUrl: "https://raw.githubusercontent.com/od-mocks/cool.repo.B/main/logo-b.png",
    initialBudget: 20000,
    leaders: ["Oscar"],
    pendingLeaderInvitations: ["Anthony"],
    repos: ["B"],
    sponsors: ["StarkNet", "Ether Foundation"],
  },
  RepoLess: {
    name: "Repo-less project",
    shortDescription: "A project without any repo",
    longDescription: "A project without any repo is like un repas sans fromage",
    telegramLink: null,
    logoUrl: null,
    initialBudget: 20000,
    pendingLeaderInvitations: ["Olivier"],
  },
  Empty: {
    name: "Empty",
    shortDescription: "A project with an empty repo",
    longDescription: "A project with an empty repo is very sad",
    telegramLink: null,
    logoUrl: null,
    initialBudget: 5000,
    repos: ["empty"],
    leaders: ["Oscar"],
  },
};
