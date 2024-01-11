import { Denops } from "../../deps.ts";
import { main as mainIssue } from "./issue.ts";
import { main as mainWiki } from "./wiki.ts";
import { main as mainBranch } from "./branch.ts";

export function main(denops: Denops): void {
  mainIssue(denops);
  mainWiki(denops);
  mainBranch(denops);
}
