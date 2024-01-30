import { BufferConfig } from "./types.ts";
import * as node from "../node/main.ts";
import {
  BASE_MAPPINGS,
  MAIN_MAPPINGS,
  POPUP_BRANCH_MAPPINGS,
  POPUP_ISSUE_MAPPINGS,
  POPUP_MR_MAPPINGS,
  POPUP_WIKI_MAPPINGS,
  RESOURCE_BRANCHES_MAPPINGS,
  RESOURCE_ISSUES_MAPPINGS,
  RESOURCE_Mrs_MAPPINGS,
  RESOURCE_WIKIS_MAPPINGS,
  UI_SELECT,
} from "../keymap/main.ts";

export const BUFFER_CONFIGS: BufferConfig[] = [
  {
    kind: "GitlaberProjectStatus",
    direction: "tab",
    nodeMaker: node.createMainPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: MAIN_MAPPINGS,
  },
  {
    kind: "GitlaberIssueConfig",
    direction: "botright",
    nodeMaker: node.createIssuePanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_ISSUE_MAPPINGS,
  },
  {
    kind: "GitlaberWikiConfig",
    direction: "botright",
    nodeMaker: node.createWikiPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_WIKI_MAPPINGS,
  },
  {
    kind: "GitlaberBranchConfig",
    direction: "botright",
    nodeMaker: node.createBranchPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_BRANCH_MAPPINGS,
  },
  {
    kind: "GitlaberMrConfig",
    direction: "botright",
    nodeMaker: node.createMergeRequestPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_MR_MAPPINGS,
  },
  {
    kind: "GitlaberIssueList",
    direction: "tab",
    nodeMaker: node.createIssuesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_ISSUES_MAPPINGS,
  },
  {
    kind: "GitlaberWikiList",
    direction: "tab",
    nodeMaker: node.createWikiNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_WIKIS_MAPPINGS,
  },
  {
    kind: "GitlaberBranchList",
    direction: "tab",
    nodeMaker: node.createBranchesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_BRANCHES_MAPPINGS,
  },
  {
    kind: "GitlaberMrList",
    direction: "tab",
    nodeMaker: node.createMergeRequestsNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_Mrs_MAPPINGS,
  },
  {
    kind: "GitlaberIssuePreview",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: false,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberIssueEdit",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberMrPreview",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: false,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberMrEdit",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberWikiPreview",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: false,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberWikiNew",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberWikiEdit",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberUiSelect",
    direction: "botright",
    options: {
      buftype: "nofile",
      modifiable: false,
      filetype: "markdown",
    },
    keymaps: UI_SELECT,
  },
  {
    kind: "GitlaberUiInput",
    direction: "botright",
    options: {
      buftype: "nofile",
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberMergedYaml",
    direction: "vertical botright",
    options: {
      filetype: "yaml",
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberMrChangeList",
    direction: "tab",
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberDiffOldFile",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberDiffNewFile",
    direction: "vertical botright",
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberMrDiscussion",
    direction: "botright",
    options: {
      filetype: "markdown",
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberMrDiscussionInspect",
    direction: "botright",
    options: {
      filetype: "markdown",
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: BASE_MAPPINGS,
  },
];
