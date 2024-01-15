import { Denops, fn, unknownutil as u, vars } from "./deps.ts";

import {
  Ctx,
  GitlaberVar,
  isGitlaberInstance,
  isGitlaberVar,
  isNode,
  ResourceKind,
} from "./types.ts";

export async function setCtx(
  denops: Denops,
  ctx: Ctx,
  bufnr: number,
) {
  await fn.setbufvar(denops, bufnr, "gitlaber_ctx", {
    ...ctx,
    parent_nodes: [...ctx.parent_nodes, ctx.current_node],
  });
}

export async function getCtx(denops: Denops, bufnr?: number): Promise<Ctx> {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  const ctx = await fn.getbufvar(denops, bufnr, "gitlaber_ctx");
  if (
    u.isObjectOf({
      instance: isGitlaberInstance,
      nodes: u.isArrayOf(isNode),
      parent_nodes: u.isArrayOf(isNode),
      current_node: isNode,
    })(ctx)
  ) {
    const current_node = await getCurrentNode(denops, ctx);
    return {
      ...ctx,
      current_node: current_node,
    };
  } else {
    throw new Error("ctx is not set");
  }
}

export const getCurrentNode = async (
  denops: Denops,
  ctx: Ctx,
) => {
  const nodes = ctx.nodes;
  const index = await fn.line(denops, ".") - 1;
  return nodes[index];
};

export const getGitlaberVar = async (denops: Denops): Promise<GitlaberVar> => {
  try {
    const gitlaberVar = await vars.g.get(denops, "gitlaber_var");
    if (!gitlaberVar) {
      return { instances: [], recent_instance_index: 0 };
    }
    if (!isGitlaberVar(gitlaberVar)) {
      return { instances: [], recent_instance_index: 0 };
    }
    return gitlaberVar;
  } catch {
    return { instances: [], recent_instance_index: 0 };
  }
};

export const setGitlaberVar = async (
  denops: Denops,
  gitlaberVar: GitlaberVar,
) => {
  await vars.g.set(denops, "gitlaber_var", gitlaberVar);
};

export const getCurrentGitlaberInstanceIndex = (
  gitalberVar: GitlaberVar,
  cwd: string,
) => {
  return gitalberVar.instances.findIndex((gitlaber) => gitlaber.cwd === cwd);
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
  return gitlaberVar.instances[index];
};

export const updateGitlaberInstanceRecentResource = async (
  denops: Denops,
  kind: ResourceKind,
) => {
  const gitlaberVar = await getGitlaberVar(denops);
  const index = getCurrentGitlaberInstanceIndex(
    gitlaberVar,
    await fn.getcwd(denops),
  );
  if (index === -1) {
    throw new Error("Not found current gitlaber instance");
  }
  gitlaberVar.instances[index].recent_resource = kind;
  await setGitlaberVar(denops, gitlaberVar);
};
