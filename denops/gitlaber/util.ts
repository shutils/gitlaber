import { Denops, fn, helper, vars } from "./deps.ts";

import {
  BaseNode,
  BranchNode,
  GitlaberVar,
  isGitlaberVar,
  IssueNode,
  MergeRequestNode,
  WikiNode,
} from "./types.ts";

export const getCurrentNode = async (
  denops: Denops,
) => {
  const nodes: Array<
    BaseNode | IssueNode | WikiNode | BranchNode | MergeRequestNode
  > = await vars.b.get(
    denops,
    "gitlaber_nodes",
  );
  const index = await fn.line(denops, ".") - 1;
  return nodes[index];
};

export const getGitlaberVar = async (denops: Denops): Promise<GitlaberVar> => {
  try {
    const gitlaberVar = await vars.g.get(denops, "gitlaber_var");
    if (!gitlaberVar) {
      return [];
    }
    if (!isGitlaberVar(gitlaberVar)) {
      return [];
    }
    return gitlaberVar;
  } catch {
    return [];
  }
};

export const getCurrentGitlaberInstanceIndex = (
  gitalberVar: GitlaberVar,
  cwd: string,
) => {
  return gitalberVar.findIndex((gitlaber) => gitlaber.cwd === cwd);
};

export const getCurrentGitlaberInstance = async (
  denops: Denops,
) => {
  const cwd = await fn.getcwd(denops);
  const gitlaberVar = await getGitlaberVar(denops);
  const index = getCurrentGitlaberInstanceIndex(gitlaberVar, cwd);
  if (index === -1) {
    throw new Error("Not found current gitlaber instance");
  }
  return gitlaberVar[index];
};

export const flattenBuffer = async (denops: Denops, bufname: string) => {
  const lines = await fn.getbufline(
    denops,
    bufname,
    1,
    "$",
  );
  return lines.join("\n");
};

export const checkOpenbrowser = async (denops: Denops) => {
  const checkOpenbrowser = await fn.exists(denops, "*OpenBrowser");
  if (!checkOpenbrowser) {
    helper.echoerr(denops, "OpenBrowser is not installed.");
    return false;
  }
  return true;
};

export const openWithBrowser = async (denops: Denops, url: string) => {
  const check = await checkOpenbrowser(denops);
  if (!check) {
    return;
  }
  await denops.call("OpenBrowser", url);
};

export function select(
  denops: Denops,
  contents: string[],
  description: string,
) {
  const texts = [description, ...contents.reverse()];
  return fn.inputlist(denops, texts);
}
