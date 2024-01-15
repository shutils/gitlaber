import { Denops, mapping, vars } from "./deps.ts";

import { BufferKind } from "./types.ts";

const mapOption: mapping.MapOptions = {
  mode: "n",
  noremap: true,
  silent: true,
  buffer: true,
};

type Mapping = {
  lhs: string;
  rhs: string;
  option?: mapping.MapOptions;
  description?: string;
};

type BufMapping = {
  kind: BufferKind;
  mappings: Mapping[];
};

const baseMappings: BufMapping = {
  kind: "base",
  mappings: [
    {
      lhs: "q",
      rhs: "<Cmd>bd!<CR>",
      option: mapOption,
      description: "Close buffer",
    },
    {
      lhs: "I",
      rhs: "<Cmd>echo gitlaber#denops#get_current_node()<CR>",
      option: mapOption,
      description: "Show current node",
    },
    {
      lhs: "g?",
      rhs: "<Cmd>call denops#notify('gitlaber', 'echoKeymaps', [])<CR>",
      option: mapOption,
      description: "Show keymaps",
    },
  ],
};

export const mappings: BufMapping[] = [
  baseMappings,
  {
    kind: "main",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "o",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openBrowserProject', [])<CR>",
        option: mapOption,
        description: "Open project in browser",
      },
      {
        lhs: "i",
        rhs: "<Cmd>call gitlaber#denops#open_issue_panel()<CR>",
        option: mapOption,
        description: "Open issue panel",
      },
      {
        lhs: "w",
        rhs: "<Cmd>call gitlaber#denops#open_wiki_panel()<CR>",
        option: mapOption,
        description: "Open wiki panel",
      },
      {
        lhs: "b",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectBranchPanel', [])<CR>",
        option: mapOption,
        description: "Open branch panel",
      },
      {
        lhs: "m",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestPanel', [])<CR>",
        option: mapOption,
        description: "Open merge request panel",
      },
    ],
  },
  {
    kind: "project_issue",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs: "<Cmd>call gitlaber#denops#open_issues_panel()<CR>",
        option: mapOption,
        description: "Open issues panel",
      },
      {
        lhs: "n",
        rhs: "<Cmd>call gitlaber#denops#create_new_pro_issue()<CR>",
        option: mapOption,
        description: "Create new issue",
      },
    ],
  },
  {
    kind: "project_issues",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "d",
        rhs: "<Cmd>call gitlaber#denops#delete_pro_issue()<CR>",
        option: mapOption,
        description: "Delete issue",
      },
      {
        lhs: "R",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'reloadBuffer', [bufnr()])<CR>",
        option: mapOption,
        description: "Reload issues",
      },
      {
        lhs: "p",
        rhs: "<Cmd>call gitlaber#denops#open_pro_issue_preview()<CR>",
        option: mapOption,
        description: "Open issue preview",
      },
      {
        lhs: "e",
        rhs: "<Cmd>call gitlaber#denops#open_pro_issue_edit()<CR>",
        option: mapOption,
        description: "Open issue edit",
      },
      {
        lhs: "b",
        rhs: "<Cmd>call denops#notify('gitlaber', 'createIssueBranch', [])<CR>",
        option: mapOption,
        description: "Create issue branch",
      },
      {
        lhs: "t",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'toggleProjectIssueState', [])<CR>",
        option: mapOption,
        description: "Toggle issue state",
      },
      {
        lhs: "o",
        rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
        option: mapOption,
        description: "Open issue in browser",
      },
      {
        lhs: "la",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'addProjectIssueLabel', [])<CR>",
        option: mapOption,
        description: "Add issue label",
      },
      {
        lhs: "lr",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'removeProjectIssueLabel', [])<CR>",
        option: mapOption,
        description: "Remove issue label",
      },
      {
        lhs: "a",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'assignIssueAssignee', [])<CR>",
        option: mapOption,
        description: "Assign issue assignee",
      },
    ],
  },
  {
    kind: "project_branch",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectBranchesPanel', [])<CR>",
        option: mapOption,
        description: "Open branches panel",
      },
    ],
  },
  {
    kind: "project_branches",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "M",
        rhs: "<Cmd>call denops#notify('gitlaber', 'createNewBranchMr', [])<CR>",
        option: mapOption,
        description: "Create new branch merge request",
      },
      {
        lhs: "o",
        rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
        option: mapOption,
        description: "Open branch in browser",
      },
    ],
  },
  {
    kind: "project_wiki",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs: "<Cmd>call gitlaber#denops#open_wikis_panel()<CR>",
        option: mapOption,
        description: "Open wikis panel",
      },
      {
        lhs: "n",
        rhs: "<Cmd>call gitlaber#denops#open_create_new_pro_wiki_buf()<CR>",
        option: mapOption,
        description: "Create new wiki",
      },
    ],
  },
  {
    kind: "project_wikis",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "d",
        rhs: "<Cmd>call gitlaber#denops#delete_pro_wiki()<CR>",
        option: mapOption,
        description: "Delete wiki",
      },
      {
        lhs: "R",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'reloadBuffer', [bufnr()])<CR>",
        option: mapOption,
        description: "Reload wikis",
      },
      {
        lhs: "p",
        rhs: "<Cmd>call gitlaber#denops#open_pro_wiki_preview()<CR>",
        option: mapOption,
        description: "Open wiki preview",
      },
      {
        lhs: "e",
        rhs: "<Cmd>call gitlaber#denops#open_edit_pro_wiki_buf()<CR>",
        option: mapOption,
        description: "Open wiki edit",
      },
      {
        lhs: "o",
        rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
        option: mapOption,
        description: "Open wiki in browser",
      },
    ],
  },
  {
    kind: "project_merge_request",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestsPanel', [])<CR>",
        option: mapOption,
        description: "Open merge requests panel",
      },
    ],
  },
  {
    kind: "project_merge_requests",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "o",
        rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
        option: mapOption,
        description: "Open merge request in browser",
      },
      {
        lhs: "a",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'assignMergeRequestAssignee', [])<CR>",
        option: mapOption,
        description: "Assign merge request assignee",
      },
      {
        lhs: "r",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'assignMergeRequestReviewer', [])<CR>",
        option: mapOption,
        description: "Assign merge request reviewer",
      },
      {
        lhs: "A",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'approveMergeRequest', [])<CR>",
        option: mapOption,
        description: "Approve a merge request",
      },
      {
        lhs: "M",
        rhs: "<Cmd>call denops#notify('gitlaber', '', [])<CR>",
        option: mapOption,
        description: "Merge a merge request",
      },
      {
        lhs: "p",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestPreview', [])<CR>",
        option: mapOption,
        description: "Open wiki preview",
      },
    ],
  },
  {
    kind: "issue_preview",
    mappings: [
      ...baseMappings.mappings,
    ],
  },
  {
    kind: "merge_request_preview",
    mappings: [
      ...baseMappings.mappings,
    ],
  },
];

export const setMapping = async (denops: Denops, kind: BufferKind) => {
  let bufMappings = mappings.find((m) => m.kind === kind);
  if (!bufMappings) {
    bufMappings = baseMappings;
    return;
  }
  for (const bufMapping of bufMappings.mappings) {
    await mapping.map(
      denops,
      bufMapping.lhs,
      bufMapping.rhs,
      bufMapping.option ?? mapOption,
    );
  }
  await vars.b.set(denops, "gitlaber_keymaps", bufMappings.mappings);
};

export const getCurrentMapping = async (denops: Denops): Promise<Mapping[]> => {
  return await vars.b.get(denops, "gitlaber_keymaps");
};
