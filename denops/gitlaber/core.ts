import { Denops, fn, unknownutil as u } from "./deps.ts";

import { Ctx, isGitlaberInstance, isNode } from "./types.ts";

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
