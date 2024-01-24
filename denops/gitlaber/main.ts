import { autocmd, Denops } from "./deps.ts";

import { main as mainBuffer } from "./buffer/main.ts";
import { main as mainAction } from "./action/main.ts";
import { initKv } from "./kv.ts";
import { registPlugMap } from "./keymap/main.ts";

export async function main(denops: Denops) {
  await initKv();
  registPlugMap(denops);
  await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
    helper.remove("User", "GitlaberRecourceUpdate");
    helper.define(
      "User",
      "GitlaberRecourceUpdate",
      "call denops#notify('gitlaber', 'command:buffer:autoreload', [])",
    );
  });
  mainBuffer(denops);
  mainAction(denops);
}
