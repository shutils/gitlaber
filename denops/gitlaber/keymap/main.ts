import { mapping } from "../deps.ts";

const MAP_OPTION: mapping.MapOptions = {
  mode: "n",
  noremap: true,
  silent: true,
  buffer: true,
};

export const BASE_MAPPINGS = [
  {
    lhs: "q",
    rhs: "<Cmd>bw!<CR>",
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

export const MAIN_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "i",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:popup:issue', [])<CR>",
    option: MAP_OPTION,
    description: "Open popup issue buffer",
  },
  {
    lhs: "w",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:popup:wiki', [])<CR>",
    option: MAP_OPTION,
    description: "Open popup wiki buffer",
  },
  {
    lhs: "b",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:popup:branch', [])<CR>",
    option: MAP_OPTION,
    description: "Open popup branch buffer",
  },
  {
    lhs: "m",
    rhs: "<Cmd>call denops#notify('gitlaber', 'buffer:open:popup:mr', [])<CR>",
    option: MAP_OPTION,
    description: "Open popup merge request buffer",
  },
  {
    lhs: "o",
    rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:project', [])<CR>",
    option: MAP_OPTION,
    description: "Open project with browser",
  },
];

export const POPUP_ISSUE_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:issues', [])<CR>",
    option: MAP_OPTION,
    description: "Open issues buffer",
  },
  {
    lhs: "N",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:new', [])<CR>",
    option: MAP_OPTION,
    description: "Open create issue",
  },
];

export const POPUP_MR_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:mrs', [])<CR>",
    option: MAP_OPTION,
    description: "Open merge requests buffer",
  },
];

export const POPUP_WIKI_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:wikis', [])<CR>",
    option: MAP_OPTION,
    description: "Open wikis buffer",
  },
  {
    lhs: "N",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:wiki:new', [])<CR>",
    option: MAP_OPTION,
    description: "Open create wiki buffer",
  },
];

export const POPUP_BRANCH_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:branches', [])<CR>",
    option: MAP_OPTION,
    description: "Open branches buffer",
  },
];

export const RESOURCE_ISSUES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:node', [])<CR>",
    option: MAP_OPTION,
    description: "Open issue with browser",
  },
  {
    lhs: "p",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:issue:prev', [])<CR>",
    option: MAP_OPTION,
    description: "Open issue preview",
  },
  {
    lhs: "e",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:issue:edit', [])<CR>",
    option: MAP_OPTION,
    description: "Edit issue",
  },
  {
    lhs: "N",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:new', [])<CR>",
    option: MAP_OPTION,
    description: "Create new issue",
  },
  {
    lhs: "d",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:delete', [])<CR>",
    option: MAP_OPTION,
    description: "Delete issue",
  },
  {
    lhs: "t",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:state:toggle', [])<CR>",
    option: MAP_OPTION,
    description: "Toggle issue state",
  },
  {
    lhs: "a",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:assign', [])<CR>",
    option: MAP_OPTION,
    description: "Assign issue assignee",
  },
  {
    lhs: "la",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:label:add', [])<CR>",
    option: MAP_OPTION,
    description: "Add label to issue",
  },
  {
    lhs: "lr",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:issue:label:remove', [])<CR>",
    option: MAP_OPTION,
    description: "Remove label from issue",
  },
  {
    lhs: "b",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:branch:new:relate:issue', [])<CR>",
    option: MAP_OPTION,
    description: "Create a branch related to the issue",
  },
];
export const RESOURCE_BRANCHES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:node', [])<CR>",
    option: MAP_OPTION,
    description: "Open branch with browser",
  },
  {
    lhs: "M",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:new:relate:branch', [])<CR>",
    option: MAP_OPTION,
    description: "Create a merge request related to the branch",
  },
];
export const RESOURCE_WIKIS_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:node', [])<CR>",
    option: MAP_OPTION,
    description: "Open wiki with browser",
  },
  {
    lhs: "p",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:wiki:prev', [])<CR>",
    option: MAP_OPTION,
    description: "Open wiki preview",
  },
  {
    lhs: "e",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:wiki:edit', [])<CR>",
    option: MAP_OPTION,
    description: "Open wiki edit",
  },
  {
    lhs: "d",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:wiki:delete', [])<CR>",
    option: MAP_OPTION,
    description: "Delete wiki",
  },
  {
    lhs: "N",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:wiki:new', [])<CR>",
    option: MAP_OPTION,
    description: "Open create wiki buffer",
  },
];
export const RESOURCE_Mrs_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Cmd>call denops#notify('gitlaber', 'action:browse:node', [])<CR>",
    option: MAP_OPTION,
    description: "Open merge request with browser",
  },
  {
    lhs: "p",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'buffer:open:resource:mr:prev', [])<CR>",
    option: MAP_OPTION,
    description: "Open merge request preview",
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
    description: "Approve merge request",
  },
  {
    lhs: "M",
    rhs:
      "<Cmd>call denops#notify('gitlaber', 'action:resource:mr:merge', [])<CR>",
    option: MAP_OPTION,
    description: "Merge merge request",
  },
];
