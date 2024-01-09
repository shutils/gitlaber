import { Denops, fn } from "./deps.ts";

import { Node } from "./types.ts";

export const setNodesOnBuf = async (
  denops: Denops,
  nodes: Array<Node>,
) => {
  const bufLines = await fn.getbufline(
    denops,
    await fn.bufname(denops),
    1,
    "$",
  );
  if (bufLines.length > nodes.length) {
    await fn.deletebufline(
      denops,
      await fn.bufname(denops),
      nodes.length + 1,
      "$",
    );
  }
  for (let i = 0; i < nodes.length; i++) {
    await fn.setline(denops, i + 1, nodes[i].display);
  }
};
