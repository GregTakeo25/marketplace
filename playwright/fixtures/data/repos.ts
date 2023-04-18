import { Repo } from "../../types";

export const repos: Record<string, Repo> = {
  A: {
    id: 602953043,
    name: "cool-repo-A",
    owner: "od-mocks",
    languages: {
      Rust: 512,
    },
  },
  B: {
    id: 602953640,
    name: "cool.repo.B",
    owner: "od-mocks",
    languages: {
      HTML: 158,
    },
  },
  noReadme: {
    id: 584840242,
    name: "no-readme",
    owner: "od-mocks",
    languages: {},
  },
  empty: {
    id: 584839416,
    name: "empty",
    owner: "od-mocks",
    languages: {},
  },
  unexisting: {
    id: 2147466666,
    name: "",
    owner: "",
    languages: {},
  },
  kakarot: {
    id: 545531678,
    name: "kakarot",
    owner: "sayajin-labs",
    languages: {
      Cairo: 759611,
      Python: 238626,
      Solidity: 49001,
      Shell: 15765,
      Makefile: 3390,
      Dockerfile: 1778,
    },
  },
};