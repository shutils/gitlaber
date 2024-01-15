import { Denops, fn, helper } from "./deps.ts";

export const flattenBuffer = async (denops: Denops, bufname: string) => {
  const lines = await fn.getbufline(
    denops,
    bufname,
    1,
    "$",
  );
  return lines.join("\n");
};

export const checkOpenbrowser = async (denops: Denops) => {
  const checkOpenbrowser = await fn.exists(denops, "*OpenBrowser");
  if (!checkOpenbrowser) {
    helper.echoerr(denops, "OpenBrowser is not installed.");
    return false;
  }
  return true;
};

export const openWithBrowser = async (denops: Denops, url: string) => {
  const check = await checkOpenbrowser(denops);
  if (!check) {
    return;
  }
  await denops.call("OpenBrowser", url);
};

export function select(
  denops: Denops,
  contents: string[],
  description: string,
) {
  const texts = [description, ...contents.reverse()];
  return fn.inputlist(denops, texts);
}
