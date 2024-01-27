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
    rhs: "<Plug>(gitlaber-action-util-echo-node)",
    option: MAP_OPTION,
    description: "Show current node",
  },
];

export const MAIN_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "i",
    rhs: "<Plug>(gitlaber-action-issue-config)",
    option: MAP_OPTION,
    description: "Open popup issue buffer",
  },
  {
    lhs: "w",
    rhs: "<Plug>(gitlaber-action-wiki-config)",
    option: MAP_OPTION,
    description: "Open popup wiki buffer",
  },
  {
    lhs: "b",
    rhs: "<Plug>(gitlaber-action-branch-config)",
    option: MAP_OPTION,
    description: "Open popup branch buffer",
  },
  {
    lhs: "m",
    rhs: "<Plug>(gitlaber-action-mr-config)",
    option: MAP_OPTION,
    description: "Open popup merge request buffer",
  },
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber-action-project-browse)",
    option: MAP_OPTION,
    description: "Open project with browser",
  },
];

export const POPUP_ISSUE_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber-action-issue-list)",
    option: MAP_OPTION,
    description: "Open issues buffer",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber-action-issue-new)",
    option: MAP_OPTION,
    description: "Open create issue",
  },
];

export const POPUP_MR_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber-action-mr-list)",
    option: MAP_OPTION,
    description: "Open merge requests buffer",
  },
];

export const POPUP_WIKI_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber-action-wiki-list)",
    option: MAP_OPTION,
    description: "Open wikis buffer",
  },
];

export const POPUP_BRANCH_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber-action-branch-list)",
    option: MAP_OPTION,
    description: "Open branches buffer",
  },
];

export const RESOURCE_ISSUES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber-action-issue-browse)",
    option: MAP_OPTION,
    description: "Open issue with browser",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber-action-issue-new)",
    option: MAP_OPTION,
    description: "Create new issue",
  },
  {
    lhs: "d",
    rhs: "<Plug>(gitlaber-action-issue-delete)",
    option: MAP_OPTION,
    description: "Delete issue",
  },
  {
    lhs: "C",
    rhs: "<Plug>(gitlaber-action-issue-close)",
    option: MAP_OPTION,
    description: "Toggle issue state",
  },
  {
    lhs: "O",
    rhs: "<Plug>(gitlaber-action-issue-reopen)",
    option: MAP_OPTION,
    description: "Assign issue assignee",
  },
  {
    lhs: "la",
    rhs: "<Plug>(gitlaber-action-issue-label)",
    option: MAP_OPTION,
    description: "Add label to issue",
  },
  {
    lhs: "lr",
    rhs: "<Plug>(gitlaber-action-issue-unlabel)",
    option: MAP_OPTION,
    description: "Remove label from issue",
  },
  {
    lhs: "b",
    rhs: "<Plug>(gitlaber-action-branch-new)",
    option: MAP_OPTION,
    description: "Create a branch related to the issue",
  },
  {
    lhs: "p",
    rhs: "<Plug>(gitlaber-action-issue-preview)",
    option: MAP_OPTION,
    description: "Open issue preview",
  },
  {
    lhs: "A",
    rhs: "<Plug>(gitlaber-action-issue-assign)",
    option: MAP_OPTION,
    description: "Assign assignee to issue",
  },
  {
    lhs: "e",
    rhs: "<Plug>(gitlaber-action-issue-edit)",
    option: MAP_OPTION,
    description: "Edit an issue description",
  },
];
export const RESOURCE_BRANCHES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber-action-branch-browse)",
    option: MAP_OPTION,
    description: "Open branch with browser",
  },
  {
    lhs: "M",
    rhs: "<Plug>(gitlaber-action-mr-new)",
    option: MAP_OPTION,
    description: "Create a merge request related to the branch",
  },
];
export const RESOURCE_WIKIS_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber-action-wiki-browse)",
    option: MAP_OPTION,
    description: "Open wiki with browser",
  },
  {
    lhs: "d",
    rhs: "<Plug>(gitlaber-action-wiki-delete)",
    option: MAP_OPTION,
    description: "Delete wiki",
  },
  {
    lhs: "p",
    rhs: "<Plug>(gitlaber-action-wiki-preview)",
    option: MAP_OPTION,
    description: "Open wiki preview",
  },
  {
    lhs: "e",
    rhs: "<Plug>(gitlaber-action-wiki-edit)",
    option: MAP_OPTION,
    description: "Open wiki edit",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber-action-wiki-new)",
    option: MAP_OPTION,
    description: "Open wiki new",
  },
];
export const RESOURCE_Mrs_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "o",
    rhs: "<Plug>(gitlaber-action-mr-browse)",
    option: MAP_OPTION,
    description: "Open merge request with browser",
  },
  {
    lhs: "a",
    rhs: "<Plug>(gitlaber-action-mr-assign-assignee)",
    option: MAP_OPTION,
    description: "Assign merge request assignee",
  },
  {
    lhs: "r",
    rhs: "<Plug>(gitlaber-action-mr-assign-reviewer)",
    option: MAP_OPTION,
    description: "Assign merge request reviewer",
  },
  {
    lhs: "A",
    rhs: "<Plug>(gitlaber-action-mr-approve)",
    option: MAP_OPTION,
    description: "Approve merge request",
  },
  {
    lhs: "U",
    rhs: "<Plug>(gitlaber-action-mr-unapprove)",
    option: MAP_OPTION,
    description: "Unapprove merge request",
  },
  {
    lhs: "M",
    rhs: "<Plug>(gitlaber-action-mr-merge)",
    option: MAP_OPTION,
    description: "Merge merge request",
  },
  {
    lhs: "p",
    rhs: "<Plug>(gitlaber-action-mr-preview)",
    option: MAP_OPTION,
    description: "Open mr preview",
  },
  {
    lhs: "e",
    rhs: "<Plug>(gitlaber-action-mr-edit)",
    option: MAP_OPTION,
    description: "Open mr edit",
  },
  {
    lhs: "la",
    rhs: "<Plug>(gitlaber-action-mr-label)",
    option: MAP_OPTION,
    description: "Label merge request",
  },
  {
    lhs: "lr",
    rhs: "<Plug>(gitlaber-action-mr-unlabel)",
    option: MAP_OPTION,
    description: "Unlable merge request",
  },
];
export const UI_SELECT = [
  ...BASE_MAPPINGS,
  {
    lhs: "<CR>",
    rhs: "<Plug>(gitlaber-action-ui-select)",
    option: MAP_OPTION,
    description: "Select current node",
  },
];

export function registPlugMap(denops: Denops) {
  actionNames.map(async (actionName) => {
    await mapping.map(
      denops,
      `<Plug>(gitlaber-action-${actionName})`,
      `<Cmd>call denops#notify('gitlaber', 'doAction', [{'name': '${actionName}'}])<CR>`,
      { noremap: true, silent: true },
    );
  });
}
