import { autocmd, Denops, helper } from "../../deps.ts";
import { ResourceKind } from "../../types.ts";
import { updateGitlaberInstanceRecentResource } from "../../core.ts";

import { main as mainIssue } from "./issue.ts";
import { main as mainBranch } from "./branch.ts";
import { main as mainMr } from "./mr.ts";
import { main as mainWiki } from "./wiki.ts";

export async function executeRequest<T>(
  denops: Denops,
  callback: (url: string, token: string, attrs: T) => Promise<void>,
  url: string,
  token: string,
  attrs: T,
  success_msg: string,
  kind: ResourceKind,
) {
  try {
    await callback(url, token, attrs);
    helper.echo(denops, success_msg);
    await updateGitlaberInstanceRecentResource(denops, kind);
    autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
  } catch (e) {
    helper.echoerr(denops, e.message);
  }
}

export function main(denops: Denops): void {
  mainIssue(denops);
  mainBranch(denops);
  mainMr(denops);
  mainWiki(denops);
}
