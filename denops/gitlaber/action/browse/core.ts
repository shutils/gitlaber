import { Denops, fn, helper } from "../../deps.ts";

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
