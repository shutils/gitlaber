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
    nodeMaker: node.createProjectIssuePanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_ISSUE_MAPPINGS,
  },
  {
    kind: "GitlaberWikiConfig",
    direction: "botright",
    nodeMaker: node.createProjectWikiPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_WIKI_MAPPINGS,
  },
  {
    kind: "GitlaberBranchConfig",
    direction: "botright",
    nodeMaker: node.createProjectBranchPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_BRANCH_MAPPINGS,
  },
  {
    kind: "GitlaberMrConfig",
    direction: "botright",
    nodeMaker: node.createProjectMergeRequestPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_MR_MAPPINGS,
  },
  {
    kind: "GitlaberIssueList",
    direction: "tab",
    nodeMaker: node.createProjectIssuesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_ISSUES_MAPPINGS,
  },
  {
    kind: "GitlaberWikiList",
    direction: "tab",
    nodeMaker: node.createProjectWikiNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_WIKIS_MAPPINGS,
  },
  {
    kind: "GitlaberBranchList",
    direction: "tab",
    nodeMaker: node.createProjectBranchesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_BRANCHES_MAPPINGS,
  },
  {
    kind: "GitlaberMrList",
    direction: "tab",
    nodeMaker: node.createProjectMergeRequestsNodes,
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
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
    tmp: true,
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
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
    tmp: true,
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
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
    tmp: true,
  },
  {
    kind: "GitlaberWikiEdit",
    direction: "vertical botright",
    options: {
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
    tmp: true,
  },
];
