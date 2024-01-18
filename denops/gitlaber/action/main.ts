import { Denops } from "../deps.ts";
import { getCurrentNode } from "../helper.ts";
import { Node } from "../types.ts";

import { main as mainResource } from "./resource/main.ts";
import { main as mainCommon } from "./common/main.ts";
import { main as mainBrowse } from "./browse/main.ts";

export async function doAction(
  denops: Denops,
  action: (denops: Denops, node: Node) => Promise<void>,
): Promise<void> {
  const node = await getCurrentNode(denops);
  action(denops, node);
}

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
  };
  mainResource(denops);
  mainCommon(denops);
  mainBrowse(denops);
}
