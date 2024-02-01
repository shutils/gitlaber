import { Denops, fn } from "../deps.ts";

import { reRenderBuffer } from "./core.ts";
import { getCurrentInstance } from "../helper.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async "command:buffer:autoreload"(): Promise<void> {
      const instance = await getCurrentInstance(denops);
      const bufnrs = instance.bufnrs;
      bufnrs.forEach(async (bufnr) => {
        const exists = await fn.bufexists(denops, bufnr);
        if (exists) {
          await reRenderBuffer(denops, bufnr);
        }
      });
    },
  };
}
