import { fn, helper, unknownutil as u } from "../../deps.ts";

import { createBuffer, reRenderBuffer } from "../../buffer/core.ts";
import { createMergedYamlNodes } from "../../node/main.ts";
import { getBufferConfig, getGitlaberVar } from "../../helper.ts";
import { ActionArgs } from "../../types.ts";
import { getLint } from "../../client/index.ts";
import { flattenBuffer, getBufferWindowId } from "../../util.ts";

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
  await createBuffer({ denops, config, nodes });
}

export async function closeBuffer(args: ActionArgs): Promise<void> {
  const actionParams = u.ensure(
    args.params,
    u.isOptionalOf(u.isObjectOf({
      bufnr: u.isNumber,
      ...u.isUnknown,
    })),
  );
  let bufnr = actionParams?.bufnr;
  if (!bufnr) {
    bufnr = await fn.bufnr(args.denops);
  }
  await fn.execute(args.denops, `bwipe ${bufnr}`);
}

export async function hideBuffer(args: ActionArgs): Promise<void> {
  const actionParams = u.ensure(
    args.params,
    u.isOptionalOf(u.isObjectOf({
      bufnr: u.isNumber,
      ...u.isUnknown,
    })),
  );
  let bufnr = actionParams?.bufnr;
  if (!bufnr) {
    bufnr = await fn.bufnr(args.denops);
  }
  const winid = await getBufferWindowId(args.denops, bufnr);
  await fn.win_execute(args.denops, winid, `hide`);
}

export async function closeAllBuffer(args: ActionArgs): Promise<void> {
  const gitlaberVar = await getGitlaberVar(args.denops);
  const buffers = gitlaberVar.buffers;
  buffers.map(async (buffer) => {
    const exists = await fn.bufexists(args.denops, buffer.bufnr);
    if (exists) {
      await fn.execute(args.denops, `bwipe ${buffer.bufnr}`);
    }
  });
}

export async function reloadBuffer(args: ActionArgs): Promise<void> {
  let bufnr: number;
  const params = u.ensure(
    args.params,
    u.isOptionalOf(u.isObjectOf({
      bufnr: u.isOptionalOf(u.isNumber),
    })),
  );
  if (params?.bufnr) {
    bufnr = params.bufnr;
  } else {
    bufnr = await fn.bufnr(args.denops);
  }
  await reRenderBuffer(args.denops, bufnr);
}
