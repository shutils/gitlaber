import { Denops, mapping } from "../deps.ts";

import { actionNames } from "../action/types.ts";

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
    rhs: "<Plug>(gitlaber:util:echo:node)",
    option: MAP_OPTION,
    description: "Show current node",
  },
];

export const MAIN_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "i",
    rhs: "<Plug>(gitlaber:issue:config)",
    option: MAP_OPTION,
    description: "Open popup issue buffer",
  },
  {
    lhs: "w",
    rhs: "<Plug>(gitlaber:wiki:config)",
    option: MAP_OPTION,
    description: "Open popup wiki buffer",
  },
  {
    lhs: "b",
    rhs: "<Plug>(gitlaber:branch:config)",
    option: MAP_OPTION,
    description: "Open popup branch buffer",
  },
  {
    lhs: "m",
    rhs: "<Plug>(gitlaber:mr:config)",
    option: MAP_OPTION,
    description: "Open popup merge request buffer",
  },
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber:project:browse)",
    option: MAP_OPTION,
    description: "Open project with browser",
  },
];

export const POPUP_ISSUE_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber:issue:list)",
    option: MAP_OPTION,
    description: "Open issues buffer",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber:issue:new)",
    option: MAP_OPTION,
    description: "Open create issue",
  },
];

export const POPUP_MR_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber:mr:list)",
    option: MAP_OPTION,
    description: "Open merge requests buffer",
  },
];

export const POPUP_WIKI_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber:wiki:list)",
    option: MAP_OPTION,
    description: "Open wikis buffer",
  },
];

export const POPUP_BRANCH_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber:branch:list)",
    option: MAP_OPTION,
    description: "Open branches buffer",
  },
];

export const RESOURCE_ISSUES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber:issue:browse)",
    option: MAP_OPTION,
    description: "Open issue with browser",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber:issue:new)",
    option: MAP_OPTION,
    description: "Create new issue",
  },
  {
    lhs: "d",
    rhs: "<Plug>(gitlaber:issue:delete)",
    option: MAP_OPTION,
    description: "Delete issue",
  },
  {
    lhs: "C",
    rhs: "<Plug>(gitlaber:issue:close)",
    option: MAP_OPTION,
    description: "Toggle issue state",
  },
  {
    lhs: "O",
    rhs: "<Plug>(gitlaber:issue:reopen)",
    option: MAP_OPTION,
    description: "Assign issue assignee",
  },
  {
    lhs: "la",
    rhs: "<Plug>(gitlaber:issue:label)",
    option: MAP_OPTION,
    description: "Add label to issue",
  },
  {
    lhs: "lr",
    rhs: "<Plug>(gitlaber:issue:unlabel)",
    option: MAP_OPTION,
    description: "Remove label from issue",
  },
  {
    lhs: "b",
    rhs: "<Plug>(gitlaber:branch:new)",
    option: MAP_OPTION,
    description: "Create a branch related to the issue",
  },
];
export const RESOURCE_BRANCHES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber:branch:browse)",
    option: MAP_OPTION,
    description: "Open branch with browser",
  },
  {
    lhs: "M",
    rhs: "<Plug>(gitlaber:mr:new)",
    option: MAP_OPTION,
    description: "Create a merge request related to the branch",
  },
];
export const RESOURCE_WIKIS_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber:wiki:browse)",
    option: MAP_OPTION,
    description: "Open wiki with browser",
  },
  {
    lhs: "d",
    rhs: "<Plug>(gitlaber:wiki:delete)",
    option: MAP_OPTION,
    description: "Delete wiki",
  },
];
export const RESOURCE_Mrs_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber:mr:browse)",
    option: MAP_OPTION,
    description: "Open merge request with browser",
  },
  {
    lhs: "a",
    rhs:
      "<Plug>(gitlaber:mr:assign:assignee)",
    option: MAP_OPTION,
    description: "Assign merge request assignee",
  },
  {
    lhs: "r",
    rhs:
      "<Plug>(gitlaber:mr:assign:reviewer)",
    option: MAP_OPTION,
    description: "Assign merge request reviewer",
  },
  {
    lhs: "A",
    rhs:
      "<Plug>(gitlaber:mr:approve)",
    option: MAP_OPTION,
    description: "Approve merge request",
  },
  {
    lhs: "U",
    rhs:
      "<Plug>(gitlaber:mr:unapprove)",
    option: MAP_OPTION,
    description: "Unapprove merge request",
  },
  {
    lhs: "M",
    rhs:
      "<Plug>(gitlaber:mr:merge)",
    option: MAP_OPTION,
    description: "Merge merge request",
  },
];

export function registPlugMap(denops: Denops) {
  actionNames.map(async (actionName) => {
    await mapping.map(
      denops,
      `<Plug>(gitlaber:${actionName})`,
      `<Cmd>call denops#notify('gitlaber', 'doAction', ['${actionName}'])<CR>`,
      { noremap: true, silent: true },
    );
  });
}
