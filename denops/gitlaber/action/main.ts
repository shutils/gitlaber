import { Denops } from "../deps.ts";
import { getContext, getCurrentNode } from "../helper.ts";
import { Context, Node } from "../types.ts";

import { main as mainResource } from "./resource/main.ts";
import { main as mainCommon } from "./common/main.ts";
import { main as mainBrowse } from "./browse/main.ts";

export async function doAction(
  denops: Denops,
  action: (
    args: Context & {
      node: Node;
    },
  ) => Promise<void>,
): Promise<void> {
  const ctx = await getContext(denops);
  const node = await getCurrentNode(denops);
  action({
    ...ctx,
    node: node,
  });
}

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
  };
  mainResource(denops);
  mainCommon(denops);
  mainBrowse(denops);
}
