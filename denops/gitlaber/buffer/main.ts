import { Denops } from "../deps.ts";

import { reRenderBuffer } from "./core.ts";
import { getCurrentInstance } from "../helper.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async "command:buffer:autoreload"(): Promise<void> {
      const instance = await getCurrentInstance(denops);
      const bufnrs = instance.bufnrs;
      bufnrs.forEach(async (bufnr) => {
        await reRenderBuffer(denops, bufnr);
      });
    },
  };
}
