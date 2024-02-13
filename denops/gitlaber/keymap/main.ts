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
    rhs: "<Plug>(gitlaber-action-buffer-close)",
    option: MAP_OPTION,
    description: "Close current buffer",
  },
  {
    lhs: "I",
    rhs: "<Plug>(gitlaber-action-util-echo-node)",
    option: MAP_OPTION,
    description: "Show current node",
  },
  {
    lhs: "R",
    rhs: "<Plug>(gitlaber-action-buffer-reload)",
    option: MAP_OPTION,
    description: "Reload current buffer",
  },
  {
    lhs: "g?",
    rhs: "<Plug>(gitlaber-action-util-echo-keymaps)",
    option: MAP_OPTION,
    description: "Show keymaps",
  },
];

export const MAIN_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "i",
    rhs: "<Plug>(gitlaber-action-issue-list)",
    option: MAP_OPTION,
    description: "Open issue list",
  },
  {
    lhs: "m",
    rhs: "<Plug>(gitlaber-action-mr-list)",
    option: MAP_OPTION,
    description: "Open merge request list",
  },
  {
    lhs: "w",
    rhs: "<Plug>(gitlaber-action-wiki-list)",
    option: MAP_OPTION,
    description: "Open wiki list",
  },
  {
    lhs: "b",
    rhs: "<Plug>(gitlaber-action-branch-list)",
    option: MAP_OPTION,
    description: "Open branch list",
  },
  {
    lhs: "p",
    rhs: "<Plug>(gitlaber-action-pipeline-list)",
    option: MAP_OPTION,
    description: "Open pipeline list",
  },
  {
    lhs: "J",
    rhs: "<Plug>(gitlaber-action-job-list)",
    option: MAP_OPTION,
    description: "Open job list",
  },
  {
    lhs: "B",
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
    lhs: "B",
    rhs: "<Plug>(gitlaber-action-issue-browse)",
    option: MAP_OPTION,
    description: "Open issue with browser",
  },
  {
    lhs: "a",
    rhs: "<Plug>(gitlaber-action-issue-assign)",
    option: MAP_OPTION,
    description: "Assign issue assignee",
  },
  {
    lhs: "O",
    rhs: "<Plug>(gitlaber-action-issue-reopen)",
    option: MAP_OPTION,
    description: "Reopen issue",
  },
  {
    lhs: "C",
    rhs: "<Plug>(gitlaber-action-issue-close)",
    option: MAP_OPTION,
    description: "Close issue",
  },
  {
    lhs: "E",
    rhs: "<Plug>(gitlaber-action-issue-edit)",
    option: MAP_OPTION,
    description: "Open issue edit",
  },
  {
    lhs: "P",
    rhs: "<Plug>(gitlaber-action-issue-preview)",
    option: MAP_OPTION,
    description: "Open issue preview",
  },
  {
    lhs: "la",
    rhs: "<Plug>(gitlaber-action-issue-label)",
    option: MAP_OPTION,
    description: "Label issue",
  },
  {
    lhs: "lr",
    rhs: "<Plug>(gitlaber-action-issue-unlabel)",
    option: MAP_OPTION,
    description: "Unlabel issue",
  },
  {
    lhs: "D",
    rhs: "<Plug>(gitlaber-action-issue-delete)",
    option: MAP_OPTION,
    description: "Delete issue",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber-action-issue-new)",
    option: MAP_OPTION,
    description: "Open issue new",
  },
  {
    lhs: "n",
    rhs: "<Plug>(gitlaber-action-issue-list-next)",
    option: MAP_OPTION,
    description: "Next page",
  },
  {
    lhs: "p",
    rhs: "<Plug>(gitlaber-action-issue-list-prev)",
    option: MAP_OPTION,
    description: "Prev page",
  },
];

export const RESOURCE_BRANCHES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "B",
    rhs: "<Plug>(gitlaber-action-branch-browse)",
    option: MAP_OPTION,
    description: "Open branch with browser",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber-action-branch-new)",
    option: MAP_OPTION,
    description: "Create new branch",
  },
  {
    lhs: "M",
    rhs: "<Plug>(gitlaber-action-mr-new)",
    option: MAP_OPTION,
    description: "Create new merge request from branch",
  },
];

export const RESOURCE_WIKIS_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "B",
    rhs: "<Plug>(gitlaber-action-wiki-browse)",
    option: MAP_OPTION,
    description: "Open wiki with browser",
  },
  {
    lhs: "N",
    rhs: "<Plug>(gitlaber-action-wiki-new)",
    option: MAP_OPTION,
    description: "Create new wiki",
  },
  {
    lhs: "P",
    rhs: "<Plug>(gitlaber-action-wiki-preview)",
    option: MAP_OPTION,
    description: "Open wiki preview",
  },
  {
    lhs: "E",
    rhs: "<Plug>(gitlaber-action-wiki-edit)",
    option: MAP_OPTION,
    description: "Edit wiki",
  },
  {
    lhs: "D",
    rhs: "<Plug>(gitlaber-action-wiki-delete)",
    option: MAP_OPTION,
    description: "Delete wiki",
  },
];

export const RESOURCE_Mrs_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "B",
    rhs: "<Plug>(gitlaber-action-mr-browse)",
    option: MAP_OPTION,
    description: "Open merge request with browser",
  },
  {
    lhs: "aa",
    rhs: "<Plug>(gitlaber-action-mr-assign-assignee)",
    option: MAP_OPTION,
    description: "Assign merge request assignee",
  },
  {
    lhs: "ar",
    rhs: "<Plug>(gitlaber-action-mr-assign-reviewer)",
    option: MAP_OPTION,
    description: "Assign merge request reviewer",
  },
  {
    lhs: "O",
    rhs: "<Plug>(gitlaber-action-mr-reopen)",
    option: MAP_OPTION,
    description: "Reopen merge request",
  },
  {
    lhs: "C",
    rhs: "<Plug>(gitlaber-action-mr-close)",
    option: MAP_OPTION,
    description: "Close merge request",
  },
  {
    lhs: "E",
    rhs: "<Plug>(gitlaber-action-mr-edit)",
    option: MAP_OPTION,
    description: "Open merge request edit",
  },
  {
    lhs: "P",
    rhs: "<Plug>(gitlaber-action-mr-preview)",
    option: MAP_OPTION,
    description: "Open merge request preview",
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
    description: "Unlabel merge request",
  },
  {
    lhs: "M",
    rhs: "<Plug>(gitlaber-action-mr-merge)",
    option: MAP_OPTION,
    description: "Merge merge request",
  },
  {
    lhs: "n",
    rhs: "<Plug>(gitlaber-action-mr-list-next)",
    option: MAP_OPTION,
    description: "Next page",
  },
  {
    lhs: "p",
    rhs: "<Plug>(gitlaber-action-mr-list-prev)",
    option: MAP_OPTION,
    description: "Prev page",
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
    lhs: "d",
    rhs: "<Plug>(gitlaber-action-mr-change-list)",
    option: MAP_OPTION,
    description: "Change list",
  },
];

export const RESOURCE_MR_CHANGE_LIST_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "<CR>",
    rhs: "<Plug>(gitlaber-action-mr-change-diff)",
    option: MAP_OPTION,
    description: "Open diff",
  },
  {
    lhs: "<C-o>",
    rhs: "<Plug>(gitlaber-action-mr-discussion-open)",
    option: MAP_OPTION,
    description: "Open discussion list",
  },
];

export const RESOURCE_MR_DIFF_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "<C-o>",
    rhs: "<Plug>(gitlaber-action-mr-discussion-open)",
    option: MAP_OPTION,
    description: "Open discussion list",
  },
  {
    lhs: "D",
    rhs: "<Plug>(gitlaber-action-mr-discussion-new)",
    option: MAP_OPTION,
    description: "Create discussion",
  },
  {
    lhs: "i",
    rhs: "<Plug>(gitlaber-action-mr-discussion-inspect)",
    option: MAP_OPTION,
    description: "Inspect discussion",
  },
];

export const RESOURCE_MR_DISCUSSION_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "A",
    rhs: "<Plug>(gitlaber-action-mr-discussion-new-overview)",
    option: MAP_OPTION,
    description: "Create discussion",
  },
];

export const RESOURCE_DISCUSSION_INSPECT_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "A",
    rhs: "<Plug>(gitlaber-action-mr-discussion-add-note)",
    option: MAP_OPTION,
    description: "Add note",
  },
];

export const RESOURCE_PIPELINES_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "B",
    rhs: "<Plug>(gitlaber-action-pipeline-browse)",
    option: MAP_OPTION,
    description: "Open pipeline with browser",
  },
  {
    lhs: "J",
    rhs: "<Plug>(gitlaber-action-job-list-for-pipeline)",
    option: MAP_OPTION,
    description: "Open job list for pipeline",
  },
];

export const RESOURCE_JOBS_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "B",
    rhs: "<Plug>(gitlaber-action-job-browse)",
    option: MAP_OPTION,
    description: "Open job with browser",
  },
  {
    lhs: "l",
    rhs: "<Plug>(gitlaber-action-job-log)",
    option: MAP_OPTION,
    description: "Open job log",
  },
];

export const RESOURCE_MR_EDIT_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "<C-s>",
    rhs: "<Plug>(gitlaber-action-mr-edit-submit)",
    option: MAP_OPTION,
    description: "Submit merge request",
  },
];

export const RESOURCE_ISSUE_EDIT_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "<C-s>",
    rhs: "<Plug>(gitlaber-action-issue-edit-submit)",
    option: MAP_OPTION,
    description: "Submit issue",
  },
];

export const RESOURCE_WIKI_EDIT_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "<C-s>",
    rhs: "<Plug>(gitlaber-action-wiki-edit-submit)",
    option: MAP_OPTION,
    description: "Submit wiki",
  },
];

export const UI_SELECT_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "<CR>",
    rhs: "<Plug>(gitlaber-action-ui-select)",
    option: MAP_OPTION,
    description: "Select current node",
  },
];

export const UI_INPUT_MAPPINGS = [
  ...BASE_MAPPINGS,
  {
    lhs: "<C-s>",
    rhs: "<Plug>(gitlaber-action-ui-input)",
    option: MAP_OPTION,
    description: "Submit input",
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
