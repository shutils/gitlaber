import { Denops, fn, vars } from "./deps.ts";

import {
  BaseNode,
  GitlaberVar,
  isGitlaberVar,
  IssueNode,
  WikiNode,
} from "./types.ts";

export const setNofile = async (denops: Denops) => {
  await fn.setbufvar(
    denops,
    await fn.bufname(denops),
    "&buftype",
    "nofile",
  );
};

export const setFileType = async (denops: Denops) => {
  await fn.setbufvar(
    denops,
    await fn.bufname(denops),
    "&filetype",
    "markdown",
  );
};

export const setModifiable = async (denops: Denops) => {
  await fn.setbufvar(
    denops,
    await fn.bufname(denops),
    "&modifiable",
    true,
  );
};

export const setNoModifiable = async (denops: Denops) => {
  await fn.setbufvar(
    denops,
    await fn.bufname(denops),
    "&modifiable",
    false,
  );
};

export const setNodesOnBuf = async (
  denops: Denops,
  nodes: Array<BaseNode | IssueNode>,
) => {
  for (let i = 0; i < nodes.length; i++) {
    await fn.setline(denops, i + 1, nodes[i].display);
  }
};

export const getCurrentNode = async (
  denops: Denops,
): Promise<BaseNode | IssueNode | WikiNode> => {
  const nodes: Array<BaseNode | IssueNode | WikiNode> = await vars.b.get(
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
