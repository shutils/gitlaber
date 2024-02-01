import { Denops, fn, vars } from "./deps.ts";
import { GITLAB_DEFAULT_URL } from "./constant.ts";

import {
  BufferKind,
  Context,
  GitlaberVar,
  Instance,
  isGitlaberVar,
  Node,
} from "./types.ts";
import { getProject } from "./client/index.ts";
import { BUFFER_CONFIGS } from "./buffer/config.ts";

export const getCurrentNode = async (
  denops: Denops,
) => {
  const gitlabVar = await getGitlaberVar(denops);
  const bufnr = await fn.bufnr(denops);
  const buffers = gitlabVar.buffers;
  const currentBuffer = buffers.find((buffer) => buffer.bufnr === bufnr);
  if (!currentBuffer) {
    return;
  }
  const nodes = currentBuffer.nodes;
  const index = await fn.line(denops, ".") - 1;
  return nodes[index];
};

export const getGitlaberVar = async (denops: Denops): Promise<GitlaberVar> => {
  const gitlaberVar = await vars.g.get(denops, "gitlaber_var");
  if (!isGitlaberVar(gitlaberVar)) {
    return {
      instances: [],
      buffers: [],
    };
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

export async function getContext(denops: Denops): Promise<Context> {
  const instance = await getCurrentInstance(denops);
  const url = getGitlabUrl(instance.cwd);
  const token = getGitlabToken(instance.cwd);
  return {
    denops: denops,
    instance: instance,
    url: url,
    token: token,
  };
}

export async function checkInstanceExists(denops: Denops) {
  const cwd = await fn.getcwd(denops);
  const gitlaberVar = await getGitlaberVar(denops);
  const instance = gitlaberVar.instances.find((instance) =>
    instance.cwd === cwd
  );
  return instance !== undefined;
}

export async function addInstance(denops: Denops) {
  const gitlaberVar = await getGitlaberVar(denops);
  const cwd = await fn.getcwd(denops);
  const url = getGitlabUrl(cwd);
  const token = getGitlabToken(cwd);
  const id = gitlaberVar.instances.length + 1;
  const instance: Instance = {
    cwd: cwd,
    bufnrs: [],
    project: await getProject(url, token, cwd),
    id: id,
  };
  gitlaberVar.instances.push(instance);
  await setGitlaberVar(denops, gitlaberVar);
}

export async function addBuffer(
  args: {
    denops: Denops;
    kind: BufferKind;
    bufnr: number;
    nodes: Node[];
    seed?: Record<string, unknown>;
  },
) {
  const { denops, kind, bufnr, nodes } = args;
  const gitlaberVar = await getGitlaberVar(denops);
  const cwd = await fn.getcwd(denops);
  const instance = gitlaberVar.instances.find((instance) =>
    instance.cwd === cwd
  );
  if (!instance) {
    throw new Error("Failed to get gitlaber instance.");
  }
  instance.bufnrs.push(bufnr);
  gitlaberVar.buffers.push({
    bufnr: bufnr,
    nodes: nodes,
    kind: kind,
    seed: args.seed ?? {},
  });
  await setGitlaberVar(denops, gitlaberVar);
}

export async function getBuffer(denops: Denops, bufnr?: number) {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  const gitlaberVar = await getGitlaberVar(denops);
  const buffer = gitlaberVar.buffers.find((buffer) => buffer.bufnr === bufnr);
  if (!buffer) {
    throw new Error("Failed to get buffer.");
  }
  return buffer;
}

export async function updateBuffer(
  args: {
    denops: Denops;
    bufnr: number;
    nodes?: Node[];
    params?: object;
    seed?: Record<string, unknown>;
  },
) {
  const { denops, bufnr, nodes, params } = args;
  const gitlaberVar = await getGitlaberVar(denops);
  const buffer = gitlaberVar.buffers.find((buffer) => buffer.bufnr === bufnr);
  if (!buffer) {
    throw new Error("Failed to get buffer.");
  }
  buffer.nodes = nodes ?? buffer.nodes;
  buffer.params = {
    ...buffer.params,
    ...params,
  };
  buffer.seed = {
    ...buffer.seed,
    ...args.seed,
  };
  await setGitlaberVar(denops, gitlaberVar);
}

export function getBufferConfig(kind: BufferKind) {
  const config = BUFFER_CONFIGS.find((config) => config.kind === kind);
  if (!config) {
    throw new Error(`Buffer config is not found: ${kind}`);
  }
  return config;
}

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

export function getParentInstanceFromBufnr(denops: Denops, bufnr: number) {
  return denops.call("gitlaber#helper#get_parent_instance_from_bufnr", bufnr);
}
