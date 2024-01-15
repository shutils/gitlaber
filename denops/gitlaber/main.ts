import { autocmd, Denops } from "./deps.ts";

import { main as mainBrowse } from "./command/browse/main.ts";
import { main as mainBuffer } from "./command/buffer/main.ts";
import { main as mainResource } from "./command/resource/main.ts";
import { main as mainCommon } from "./command/common/main.ts";

export async function main(denops: Denops) {
  await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
    helper.remove("User", "GitlaberRecourceUpdate");
    helper.define(
      "User",
      "GitlaberRecourceUpdate",
      "call denops#notify('gitlaber', 'updateResourceBuffer', [])",
    );
  });
  mainBrowse(denops);
  mainBuffer(denops);
  mainResource(denops);
  mainCommon(denops);
}
