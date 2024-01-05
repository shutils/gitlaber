import { Denops, fn, vars } from "./deps.ts";

import { BaseNode, IssueNode } from "./types.ts";

export const setNofile = async (denops: Denops) => {
  await fn.setbufvar(
    denops,
    await fn.bufname(denops),
    "&buftype",
    "nofile",
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
): Promise<BaseNode | IssueNode> => {
  const nodes: Array<BaseNode | IssueNode> = await vars.b.get(
    denops,
    "nodes",
  );
  const index = await fn.line(denops, ".") - 1;
  return nodes[index];
};