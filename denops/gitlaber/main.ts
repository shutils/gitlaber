import { autocmd, Denops } from "./deps.ts";

import { main as mainBuffer } from "./command/buffer/main.ts";
import { main as mainAction } from "./action/main.ts";

export async function main(denops: Denops) {
  await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
    helper.remove("User", "GitlaberRecourceUpdate");
    helper.define(
      "User",
      "GitlaberRecourceUpdate",
      "call denops#notify('gitlaber', 'updateResourceBuffer', [])",
    );
  });
  mainBuffer(denops);
  mainAction(denops);
}
