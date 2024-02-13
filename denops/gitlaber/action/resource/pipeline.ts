import { ActionArgs, Pipeline } from "../../types.ts";
import * as util from "../../util.ts";
import { openWithBrowser } from "../browse/core.ts";
import { createBuffer } from "../../buffer/core.ts";
import { getBufferConfig } from "../../helper.ts";
import {
  argsHasPipeline,
  getPipelineFromArgs,
  selectPipeline,
} from "./common.ts";

export async function openPipelineList(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const config = getBufferConfig("GitlaberPipelineList");
  const seed = {
    url: args.ctx.url,
    token: args.ctx.token,
    id: args.ctx.instance.project.id,
  };
  const bufnr = await createBuffer({ denops, config, seed });
  await util.focusBuffer(args.denops, bufnr);
}

export async function brwosePipeline(args: ActionArgs): Promise<void> {
  const { denops } = args;
  let pipeline: Pipeline;
  if (argsHasPipeline(args)) {
    pipeline = getPipelineFromArgs(args);
  } else {
    selectPipeline(args);
    return;
  }
  await openWithBrowser(denops, pipeline.web_url);
}
