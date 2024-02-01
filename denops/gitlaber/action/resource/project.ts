import { ActionArgs } from "../../types.ts";
import { openWithBrowser } from "../browse/core.ts";
import { getBufferConfig } from "../../helper.ts";
import { createBuffer } from "../../buffer/core.ts";
import { focusBuffer } from "../../util.ts";

export async function browseProject(args: ActionArgs) {
  const { denops, ctx } = args;
  await openWithBrowser(denops, ctx.instance.project.web_url);
}

export async function openProjectStatus(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberProjectStatus");
  const bufnr = await createBuffer({ denops: args.denops, config });
  await focusBuffer(args.denops, bufnr);
}
