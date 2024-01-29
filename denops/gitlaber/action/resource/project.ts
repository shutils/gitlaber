import { ActionArgs } from "../../types.ts";
import { openWithBrowser } from "../browse/core.ts";
import { getBufferConfig } from "../../helper.ts";
import { createBuffer } from "../../buffer/core.ts";
import { createMainPanelNodes } from "../../node/main.ts";
import { focusBuffer } from "../../util.ts";

export async function browseProject(args: ActionArgs) {
  const { denops, ctx } = args;
  await openWithBrowser(denops, ctx.instance.project.web_url);
}

export async function openProjectStatus(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberProjectStatus");
  const nodes = await createMainPanelNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await focusBuffer(args.denops, bufnr);
}
