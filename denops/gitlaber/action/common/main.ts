import { fn, helper } from "../../deps.ts";

import { createBuffer } from "../../buffer/core.ts";
import { createMergedYamlNodes } from "../../node/main.ts";
import { getBufferConfig } from "../../buffer/helper.ts";
import { ActionArgs } from "../../types.ts";
import { getLint } from "../../client/index.ts";
import { flattenBuffer } from "../../util.ts";

export async function echoNode(args: ActionArgs): Promise<void> {
  const { denops, node } = args;
  if (!node) {
    await helper.echo(denops, "This line is not node.");
    return;
  }
  await helper.echo(denops, Deno.inspect(node, { depth: Infinity }));
}

export async function openMergedYaml(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const { url, token } = args.ctx;
  const { id } = args.ctx.instance.project;
  const content = await flattenBuffer(
    denops,
    await fn.bufname(denops, await fn.bufnr(denops)),
  );
  const config = getBufferConfig("GitlaberMergedYaml");
  const lint = await getLint(url, token, { id, content });
  if (!lint.valid) {
    await helper.echoerr(
      denops,
      `Invalid yaml. \n\nmessage: ${lint.errors.join("\n")}`,
    );
    return;
  }
  const nodes = await createMergedYamlNodes(lint);
  await createBuffer(args.denops, config, nodes);
}

export async function closeBuffer(args: ActionArgs): Promise<void> {
  await fn.execute(args.denops, "bwipe");
}
