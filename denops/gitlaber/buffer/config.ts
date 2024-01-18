import { mapping } from "../deps.ts";

import { BufferConfig } from "./types.ts";
import * as node from "../node/main.ts";

const MAP_OPTION: mapping.MapOptions = {
  mode: "n",
  noremap: true,
  silent: true,
  buffer: true,
};

const BASE_MAPPINGS = [
  {
    lhs: "q",
    rhs: "<Cmd>bd!<CR>",
    option: MAP_OPTION,
    description: "Close buffer",
  },
  {
    lhs: "I",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:common:echo:node', [])<CR>",
    option: MAP_OPTION,
    description: "Show current node",
  },
  {
    lhs: "g?",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:common:echo:keymaps', [])<CR>",
    option: MAP_OPTION,
    description: "Show keymaps",
  },
] as const;

const BUFFER_CONFIGS: BufferConfig[] = [
  {
    kind: "GitlaberMain",
    nodeMaker: node.createMainPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberPopupIssue",
    nodeMaker: node.createProjectIssuePanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberPopupWiki",
    nodeMaker: node.createProjectWikiNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberPopupBranch",
    nodeMaker: node.createProjectBranchPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberPopupMr",
    nodeMaker: node.createProjectMergeRequestPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberResourceIssues",
    nodeMaker: node.createProjectIssuesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberResourceWikis",
    nodeMaker: node.createProjectWikiNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberResourceBranches",
    nodeMaker: node.createProjectBranchesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberResourceMrs",
    nodeMaker: node.createProjectMergeRequestsNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberPreviewIssue",
    nodeMaker: node.createDescriptionNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberPreviewWiki",
    nodeMaker: node.createContentNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberPreviewMr",
    nodeMaker: node.createDescriptionNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
  },
  {
    kind: "GitlaberEditIssue",
    nodeMaker: node.createDescriptionNodes,
    options: {
      modifiable: true,
    },
  },
  {
    kind: "GitlaberEditWiki",
    nodeMaker: node.createContentNodes,
    options: {
      modifiable: true,
    },
  },
  {
    kind: "GitlaberCreateWiki",
    nodeMaker: node.createEmptyNodes,
    options: {
      modifiable: true,
    },
  },
];
