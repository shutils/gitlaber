import { Denops, fn, vars } from "./deps.ts";
import { GITLAB_DEFAULT_URL } from "./constant.ts";

import { GitlaberVar, isGitlaberVar } from "./types.ts";

export const getCurrentNode = async (
  denops: Denops,
) => {
  const gitlabVar = await getGitlaberVar(denops);
  const bufnr = await fn.bufnr(denops);
  const buffers = gitlabVar.buffers;
  const currentBuffer = buffers.find((buffer) => buffer.bufnr === bufnr);
  if (!currentBuffer) {
    throw new Error("Failed to get current buffer.");
  }
  const nodes = currentBuffer.nodes;
  const index = await fn.line(denops, ".") - 1;
  return nodes[index];
};

export const getGitlaberVar = async (denops: Denops): Promise<GitlaberVar> => {
  const gitlaberVar = await vars.g.get(denops, "gitlaber_var");
  if (!isGitlaberVar(gitlaberVar)) {
    throw new Error("Failed to get gitlaber var.");
  }
  return gitlaberVar;
};

export const setGitlaberVar = async (
  denops: Denops,
  gitlaberVar: GitlaberVar,
) => {
  await vars.g.set(denops, "gitlaber_var", gitlaberVar);
};

export async function getCurrentInstance(denops: Denops) {
  const cwd = await fn.getcwd(denops);
  const gitlaberVar = await getGitlaberVar(denops);
  const instance = gitlaberVar.instances.find((instance) =>
    instance.cwd === cwd
  );
  if (!instance) {
    throw new Error("Failed to get gitlaber instance.");
  }
  return instance;
}

// export const updateGitlaberInstanceRecentResource = async (
//   denops: Denops,
//   kind: ResourceKind,
// ) => {
//   const gitlaberVar = await getGitlaberVar(denops);
//   const index = getCurrentGitlaberInstanceIndex(
//     gitlaberVar,
//     await fn.getcwd(denops),
//   );
//   if (index === -1) {
//     throw new Error("Not found current gitlaber instance");
//   }
//   gitlaberVar.instances[index].recent_resource = kind;
//   await setGitlaberVar(denops, gitlaberVar);
// };
//
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
