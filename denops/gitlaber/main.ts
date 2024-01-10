import { Denops } from "./deps.ts";

import { main as mainBrowse } from "./command/browse/main.ts";
import { main as mainBuffer } from "./command/buffer/main.ts";
import { main as mainResource } from "./command/resource/main.ts";
import { main as mainCommon } from "./command/common/main.ts";

export function main(denops: Denops) {
  mainBrowse(denops);
  mainBuffer(denops);
  mainResource(denops);
  mainCommon(denops);
}
