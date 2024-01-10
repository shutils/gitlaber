import { Denops, mapping } from "./deps.ts";

const mapOption: mapping.MapOptions = {
  mode: "n",
  noremap: true,
  silent: true,
  buffer: true,
};

export type BufName =
  | "base"
  | "main"
  | "projectIssue"
  | "projectIssues"
  | "projectBranch"
  | "projectBranches"
  | "projectWiki"
  | "projectWikis"
  | "projectMergeRequest"
  | "projectMergeRequests";

type Mapping = {
  lhs: string;
  rhs: string;
  option?: mapping.MapOptions;
};

type BufMapping = {
  name: BufName;
  mappings: Mapping[];
};

const baseMappings: BufMapping = {
  name: "base",
  mappings: [
    {
      lhs: "q",
      rhs: "<Cmd>bd!<CR>",
      option: mapOption,
    },
    {
      lhs: "I",
      rhs: "<Cmd>echo gitlaber#denops#get_current_node()<CR>",
      option: mapOption,
    },
  ],
};

export const mappings: BufMapping[] = [
  baseMappings,
  {
    name: "main",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "o",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openBrowserProject', [])<CR>",
        option: mapOption,
      },
      {
        lhs: "i",
        rhs: "<Cmd>call gitlaber#denops#open_issue_panel()<CR>",
        option: mapOption,
      },
      {
        lhs: "w",
        rhs: "<Cmd>call gitlaber#denops#open_wiki_panel()<CR>",
        option: mapOption,
      },
      {
        lhs: "b",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectBranchPanel', [])<CR>",
        option: mapOption,
      },
      {
        lhs: "m",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestPanel', [])<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectIssue",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs: "<Cmd>call gitlaber#denops#open_issues_panel()<CR>",
        option: mapOption,
      },
      {
        lhs: "n",
        rhs: "<Cmd>call gitlaber#denops#create_new_pro_issue()<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectIssues",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "d",
        rhs: "<Cmd>call gitlaber#denops#delete_pro_issue()<CR>",
        option: mapOption,
      },
      {
        lhs: "r",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'reloadProjectIssues', [bufnr()])<CR>",
        option: mapOption,
      },
      {
        lhs: "p",
        rhs: "<Cmd>call gitlaber#denops#open_pro_issue_preview()<CR>",
        option: mapOption,
      },
      {
        lhs: "e",
        rhs: "<Cmd>call gitlaber#denops#open_pro_issue_edit()<CR>",
        option: mapOption,
      },
      {
        lhs: "b",
        rhs: "<Cmd>call denops#notify('gitlaber', 'createIssueBranch', [])<CR>",
        option: mapOption,
      },
      {
        lhs: "o",
        rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserIssue', [])<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectBranch",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectBranchesPanel', [])<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectBranches",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "M",
        rhs: "<Cmd>call denops#notify('gitlaber', 'createNewBranchMr', [])<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectWiki",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs: "<Cmd>call gitlaber#denops#open_wikis_panel()<CR>",
        option: mapOption,
      },
      {
        lhs: "n",
        rhs: "<Cmd>call gitlaber#denops#open_create_new_pro_wiki_buf()<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectWikis",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "d",
        rhs: "<Cmd>call gitlaber#denops#delete_pro_wiki()<CR>",
        option: mapOption,
      },
      {
        lhs: "r",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'reloadProjectWikis', [bufnr()])<CR>",
        option: mapOption,
      },
      {
        lhs: "p",
        rhs: "<Cmd>call gitlaber#denops#open_pro_wiki_preview()<CR>",
        option: mapOption,
      },
      {
        lhs: "e",
        rhs: "<Cmd>call gitlaber#denops#open_edit_pro_wiki_buf()<CR>",
        option: mapOption,
      },
      {
        lhs: "o",
        rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserWiki', [])<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectMergeRequest",
    mappings: [
      ...baseMappings.mappings,
      {
        lhs: "l",
        rhs:
          "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestsPanel', [])<CR>",
        option: mapOption,
      },
    ],
  },
  {
    name: "projectMergeRequests",
    mappings: [
      ...baseMappings.mappings,
    ],
  },
];

export const setMapping = async (denops: Denops, name: BufName) => {
  let bufMappings = mappings.find((m) => m.name === name);
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
};
