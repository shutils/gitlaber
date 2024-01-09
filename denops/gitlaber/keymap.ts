import { Denops, mapping } from "./deps.ts";

const mapOption: mapping.MapOptions = {
  mode: "n",
  noremap: true,
  silent: true,
  buffer: true,
};

export const setBaseMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "q",
    "<Cmd>bd!<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "I",
    "<Cmd>echo gitlaber#denops#get_current_node()<CR>",
    mapOption,
  );
};

export const setGlobalMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "<Leader>gl",
    "<Cmd>call gitlaber#denops#open_main_panel()<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};

export const setMainPanelMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "i",
    "<Cmd>call gitlaber#denops#open_issue_panel()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "w",
    "<Cmd>call gitlaber#denops#open_wiki_panel()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "b",
    "<Cmd>call denops#notify('gitlaber', 'openProjectBranchPanel', [])<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "o",
    "<Cmd>call denops#notify('gitlaber', 'openBrowserProject', [])<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};

export const setProjectIssuePanelMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "l",
    "<Cmd>call gitlaber#denops#open_issues_panel()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "n",
    "<Cmd>call gitlaber#denops#create_new_pro_issue()<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};

export const setProjectIssuesPanelMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "d",
    "<Cmd>call gitlaber#denops#delete_pro_issue()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "r",
    "<Cmd>call gitlaber#denops#reload_pro_issue()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "p",
    "<Cmd>call gitlaber#denops#open_pro_issue_preview()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "e",
    "<Cmd>call gitlaber#denops#open_pro_issue_edit()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "b",
    "<Cmd>call denops#notify('gitlaber', 'createIssueBranch', [])<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "o",
    "<Cmd>call denops#notify('gitlaber', 'openBrowserIssue', [])<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};

export const setProjectBranchPanelMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "l",
    "<Cmd>call denops#notify('gitlaber', 'openProjectBranchesPanel', [])<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};

export const setProjectBranchesPanelMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "M",
    "<Cmd>call denops#notify('gitlaber', 'createNewBranchMr', [])<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};

export const setProjectWikiPanelMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "l",
    "<Cmd>call gitlaber#denops#open_wikis_panel()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "n",
    "<Cmd>call gitlaber#denops#open_create_new_pro_wiki_buf()<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};

export const setProjectWikisPanelMapping = async (denops: Denops) => {
  await mapping.map(
    denops,
    "d",
    "<Cmd>call gitlaber#denops#delete_pro_wiki()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "r",
    "<Cmd>call gitlaber#denops#reload_pro_wikis()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "p",
    "<Cmd>call gitlaber#denops#open_pro_wiki_preview()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "e",
    "<Cmd>call gitlaber#denops#open_edit_pro_wiki_buf()<CR>",
    mapOption,
  );
  await mapping.map(
    denops,
    "o",
    "<Cmd>call denops#notify('gitlaber', 'openBrowserWiki', [])<CR>",
    mapOption,
  );
  await setBaseMapping(denops);
};
