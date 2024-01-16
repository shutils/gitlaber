import { mapping } from "../../deps.ts";

import * as node from "./node.ts";
import * as types from "../../types.ts";

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
];

const MAIN_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "main",
  resource_kind: "other",
  config: {
    direction: "tabnew",
    node_creater: node.createMainPanelNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "o",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:browse:project', [])<CR>",
      option: MAP_OPTION,
      description: "Open project in browser",
    },
    {
      lhs: "i",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectIssuePanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open issue panel",
    },
    {
      lhs: "w",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectWikiPanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open wiki panel",
    },
    {
      lhs: "b",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectBranchPanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open branch panel",
    },
    {
      lhs: "m",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestPanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open merge request panel",
    },
  ],
};

const PROJECT_ISSUE_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_issue",
  resource_kind: "other",
  config: {
    direction: "botright new",
    node_creater: node.createProjectIssuePanelNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "l",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectIssuesPanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open issues panel",
    },
    {
      lhs: "n",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:new', [])<CR>",
      option: MAP_OPTION,
      description: "Create new issue",
    },
  ],
};

const PROJECT_ISSUES_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_issues",
  resource_kind: "issue",
  config: {
    direction: "vertical botright new",
    node_creater: node.createProjectIssuesNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "d",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:delete', [])<CR>",
      option: MAP_OPTION,
      description: "Delete issue",
    },
    {
      lhs: "R",
      rhs: "<Cmd>call denops#notify('gitlaber', 'reloadBuffer', [bufnr()])<CR>",
      option: MAP_OPTION,
      description: "Reload issues",
    },
    {
      lhs: "p",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:prev', [])<CR>",
      option: MAP_OPTION,
      description: "Open issue preview",
    },
    {
      lhs: "e",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:edit', [])<CR>",
      option: MAP_OPTION,
      description: "Open issue edit",
    },
    {
      lhs: "b",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:branch:new:relate:issue', [])<CR>",
      option: MAP_OPTION,
      description: "Create related branch",
    },
    {
      lhs: "t",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:state:toggle', [])<CR>",
      option: MAP_OPTION,
      description: "Toggle issue state",
    },
    {
      lhs: "o",
      rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:node', [])<CR>",
      option: MAP_OPTION,
      description: "Open issue in browser",
    },
    {
      lhs: "la",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:label:add', [])<CR>",
      option: MAP_OPTION,
      description: "Add issue label",
    },
    {
      lhs: "lr",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:label:remove', [])<CR>",
      option: MAP_OPTION,
      description: "Remove issue label",
    },
    {
      lhs: "a",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:assign', [])<CR>",
      option: MAP_OPTION,
      description: "Assign issue assignee",
    },
  ],
};

const PROJECT_BRANCH_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_branch",
  resource_kind: "other",
  config: {
    direction: "botright new",
    node_creater: node.createProjectBranchPanelNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "l",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectBranchesPanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open branches panel",
    },
  ],
};

const PROJECT_BRANCHES_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_branches",
  resource_kind: "branch",
  config: {
    direction: "vertical botright new",
    node_creater: node.createProjectBranchesNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "M",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:new:relate:branch', [])<CR>",
      option: MAP_OPTION,
      description: "Create related merge request",
    },
    {
      lhs: "o",
      rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:node', [])<CR>",
      option: MAP_OPTION,
      description: "Open branch in browser",
    },
  ],
};

const PROJECT_WIKI_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_wiki",
  resource_kind: "other",
  config: {
    direction: "botright new",
    node_creater: node.createProjectWikiPanelNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "l",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectWikisPanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open wikis panel",
    },
    {
      lhs: "n",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:wiki:new', [])<CR>",
      option: MAP_OPTION,
      description: "Create new wiki",
    },
  ],
};

const PROJECT_WIKIS_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_wikis",
  resource_kind: "wiki",
  config: {
    direction: "vertical botright new",
    node_creater: node.createProjectWikiNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "d",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:wiki:delete', [])<CR>",
      option: MAP_OPTION,
      description: "Delete wiki",
    },
    {
      lhs: "R",
      rhs: "<Cmd>call denops#notify('gitlaber', 'reloadBuffer', [bufnr()])<CR>",
      option: MAP_OPTION,
      description: "Reload wikis",
    },
    {
      lhs: "p",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:wiki:prev', [])<CR>",
      option: MAP_OPTION,
      description: "Open wiki preview",
    },
    {
      lhs: "e",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:wiki:edit', [])<CR>",
      option: MAP_OPTION,
      description: "Open wiki edit",
    },
    {
      lhs: "o",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:common:echo:node', [])<CR>",
      option: MAP_OPTION,
      description: "Open wiki in browser",
    },
  ],
};

const PROJECT_MERGE_REQUEST_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_merge_request",
  resource_kind: "other",
  config: {
    direction: "botright new",
    node_creater: node.createProjectMergeRequestPanelNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "l",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestsPanel', [])<CR>",
      option: MAP_OPTION,
      description: "Open merge requests panel",
    },
  ],
};

const PROJECT_MERGE_REQUESTS_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "project_merge_requests",
  resource_kind: "merge_request",
  config: {
    direction: "vertical botright new",
    node_creater: node.createProjectMergeRequestsNodes,
    options: {
      nofile: true,
      nomodifiable: true,
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
    {
      lhs: "o",
      rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:node', [])<CR>",
      option: MAP_OPTION,
      description: "Open merge request in browser",
    },
    {
      lhs: "a",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:assign:assignee', [])<CR>",
      option: MAP_OPTION,
      description: "Assign merge request assignee",
    },
    {
      lhs: "r",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:assign:reviewer', [])<CR>",
      option: MAP_OPTION,
      description: "Assign merge request reviewer",
    },
    {
      lhs: "A",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:approve', [])<CR>",
      option: MAP_OPTION,
      description: "Approve a merge request",
    },
    {
      lhs: "M",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:merge', [])<CR>",
      option: MAP_OPTION,
      description: "Merge a merge request",
    },
    {
      lhs: "p",
      rhs:
        "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:prev', [])<CR>",
      option: MAP_OPTION,
      description: "Open a merge request preview",
    },
  ],
};

const ISSUE_PREVIEW_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "issue_preview",
  resource_kind: "other",
  config: {
    direction: "new",
    node_creater: node.createPreviewNodes,
    options: {
      nofile: true,
      nomodifiable: true,
      filetype: "markdown",
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
  ],
};

const ISSUE_EDIT_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "issue_edit",
  resource_kind: "other",
  config: {
    direction: "new",
    node_creater: node.createPreviewNodes,
    options: {
      nofile: false,
      nomodifiable: false,
      filetype: "markdown",
    },
    tmp: true,
  },
  keymaps: [
    ...BASE_MAPPINGS,
  ],
};

const MERGE_REQUEST_PREVIEW_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "merge_request_preview",
  resource_kind: "other",
  config: {
    direction: "new",
    node_creater: node.createPreviewNodes,
    options: {
      nofile: true,
      nomodifiable: true,
      filetype: "markdown",
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
  ],
};

const WIKI_CREATE_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "wiki_create",
  resource_kind: "other",
  config: {
    direction: "vertical botright new",
    node_creater: (_denops, _ctx) => Promise.resolve([]),
    options: {
      nofile: false,
      nomodifiable: false,
      filetype: "markdown",
    },
    tmp: true,
  },
  keymaps: [
    ...BASE_MAPPINGS,
  ],
};

const WIKI_EDIT_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "wiki_edit",
  resource_kind: "other",
  config: {
    direction: "new",
    node_creater: node.createProjectWikiContentNodes,
    options: {
      nofile: false,
      nomodifiable: false,
      filetype: "markdown",
    },
    tmp: true,
  },
  keymaps: [
    ...BASE_MAPPINGS,
  ],
};

const WIKI_PREVIEW_BUFFER_INFO: types.BufferInfo = {
  buffer_kind: "wiki_preview",
  resource_kind: "other",
  config: {
    direction: "new",
    node_creater: node.createProjectWikiContentNodes,
    options: {
      nofile: true,
      nomodifiable: true,
      filetype: "markdown",
    },
  },
  keymaps: [
    ...BASE_MAPPINGS,
  ],
};

const bufferInfos: types.BufferInfo[] = [
  MAIN_BUFFER_INFO,
  PROJECT_ISSUE_BUFFER_INFO,
  PROJECT_ISSUES_BUFFER_INFO,
  PROJECT_BRANCH_BUFFER_INFO,
  PROJECT_BRANCHES_BUFFER_INFO,
  PROJECT_WIKI_BUFFER_INFO,
  PROJECT_WIKIS_BUFFER_INFO,
  PROJECT_MERGE_REQUEST_BUFFER_INFO,
  PROJECT_MERGE_REQUESTS_BUFFER_INFO,
  ISSUE_PREVIEW_BUFFER_INFO,
  ISSUE_EDIT_BUFFER_INFO,
  MERGE_REQUEST_PREVIEW_BUFFER_INFO,
  WIKI_CREATE_BUFFER_INFO,
  WIKI_EDIT_BUFFER_INFO,
  WIKI_PREVIEW_BUFFER_INFO,
];

export function selectBufferInfo(kind: types.BufferKind): types.BufferInfo {
  const bufferInfo = bufferInfos.find((buffer) => buffer.buffer_kind === kind);
  if (!bufferInfo) {
    throw new Error(
      `Cannot find buffer info for specified kind. kind: ${kind}`,
    );
  }
  return bufferInfo;
}
