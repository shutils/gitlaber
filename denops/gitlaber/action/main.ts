import { Denops } from "../deps.ts";
import { getCtx } from "../helper.ts";
import { Ctx } from "../types.ts";

import { main as mainResource } from "./resource/main.ts";
import { main as mainCommon } from "./common/main.ts";
import { main as mainBrowse } from "./browse/main.ts";

export async function doAction(
  denops: Denops,
  action: (denops: Denops, ctx: Ctx) => Promise<void>,
): Promise<void> {
  const ctx = await getCtx(denops);
  action(denops, ctx);
}

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
  };
  mainResource(denops);
  mainCommon(denops);
  mainBrowse(denops);
}
