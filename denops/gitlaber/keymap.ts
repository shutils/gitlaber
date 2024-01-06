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
  await setBaseMapping(denops);
};
