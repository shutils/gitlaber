import { ActionArgs } from "../../types.ts";
import { openWithBrowser } from "../browse/core.ts";

export async function browseProject(args: ActionArgs) {
  const { denops, ctx } = args;
  await openWithBrowser(denops, ctx.instance.project.web_url);
}
