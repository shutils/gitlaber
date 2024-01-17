import { Denops, fn, unknownutil as u, vars } from "./deps.ts";
import { GITLAB_DEFAULT_URL } from "./constant.ts";

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
  await fn.setbufvar(denops, bufnr, "gitlaber_ctx", ctx);
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
    })(ctx)
  ) {
    return ctx;
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

export function getGitlabUrl(cwd?: string) {
  try {
    return exec("git", ["config", "--get", "gitlab.url"], cwd);
  } catch {
    const url = Deno.env.get("GITLAB_URL");
    if (url) {
      return url;
    } else {
      return GITLAB_DEFAULT_URL;
    }
  }
}

export function getGitlabToken(cwd?: string) {
  try {
    return exec("git", ["config", "--get", "gitlab.token"], cwd);
  } catch {
    const token = Deno.env.get("GITLAB_TOKEN");
    if (token) {
      return token;
    } else {
      throw new Error("Unable to get GitLab token");
    }
  }
}

export function exec(cmd: string, args: string[], cwd?: string) {
  const result = new Deno.Command(cmd, {
    args: args,
    cwd: cwd,
  });
  const { success, stdout, stderr } = result.outputSync();
  if (success === true) {
    const std = new TextDecoder().decode(stdout).replace(/\n/g, "");
    return std;
  } else {
    throw new Error(
      `An error occurred while executing the command (${cmd}). reason: ${
        new TextDecoder().decode(stderr)
      }`,
    );
  }
}
