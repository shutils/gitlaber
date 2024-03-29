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
    kind: "GitlaberMain",
    direction: "tab",
    nodeMaker: node.createMainPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: MAIN_MAPPINGS,
  },
  {
    kind: "GitlaberPopupIssue",
    direction: "botright",
    nodeMaker: node.createProjectIssuePanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_ISSUE_MAPPINGS,
  },
  {
    kind: "GitlaberPopupWiki",
    direction: "botright",
    nodeMaker: node.createProjectWikiPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_WIKI_MAPPINGS,
  },
  {
    kind: "GitlaberPopupBranch",
    direction: "botright",
    nodeMaker: node.createProjectBranchPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_BRANCH_MAPPINGS,
  },
  {
    kind: "GitlaberPopupMr",
    direction: "botright",
    nodeMaker: node.createProjectMergeRequestPanelNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: POPUP_MR_MAPPINGS,
  },
  {
    kind: "GitlaberResourceIssues",
    direction: "vertical botright",
    nodeMaker: node.createProjectIssuesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_ISSUES_MAPPINGS,
  },
  {
    kind: "GitlaberResourceWikis",
    direction: "vertical botright",
    nodeMaker: node.createProjectWikiNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_WIKIS_MAPPINGS,
  },
  {
    kind: "GitlaberResourceBranches",
    direction: "vertical botright",
    nodeMaker: node.createProjectBranchesNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_BRANCHES_MAPPINGS,
  },
  {
    kind: "GitlaberResourceMrs",
    direction: "vertical botright",
    nodeMaker: node.createProjectMergeRequestsNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
    },
    keymaps: RESOURCE_Mrs_MAPPINGS,
  },
  {
    kind: "GitlaberPreviewIssue",
    direction: "aboveleft",
    nodeMaker: node.createDescriptionNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberPreviewWiki",
    direction: "aboveleft",
    nodeMaker: node.createContentNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberPreviewMr",
    direction: "aboveleft",
    nodeMaker: node.createDescriptionNodes,
    options: {
      buftype: "nofile",
      modifiable: false,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
  },
  {
    kind: "GitlaberEditIssue",
    direction: "aboveleft",
    nodeMaker: node.createDescriptionEditNodes,
    options: {
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
    tmp: true,
  },
  {
    kind: "GitlaberEditWiki",
    direction: "aboveleft",
    nodeMaker: node.createContentNodes,
    options: {
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
    tmp: true,
  },
  {
    kind: "GitlaberCreateWiki",
    direction: "vertical botright",
    nodeMaker: node.createEmptyNodes,
    options: {
      modifiable: true,
      filetype: "markdown",
    },
    keymaps: BASE_MAPPINGS,
    tmp: true,
  },
];
