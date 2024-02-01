import { fn, option, unknownutil as u } from "../../deps.ts";

import { createBuffer } from "../../buffer/core.ts";
import { getBuffer, getBufferConfig, updateBuffer } from "../../helper.ts";
import { flattenBuffer } from "../../util.ts";
import { ActionArgs, isAction, Node } from "../../types.ts";

export async function openUiSelect(
  args: ActionArgs,
  nodes: Node[],
): Promise<void> {
  const config = getBufferConfig("GitlaberUiSelect");
  const maxRow = await option.lines.getGlobal(args.denops) / 3;
  const row = nodes.length > maxRow ? maxRow : nodes.length;
  const bufnr = await createBuffer(
    {
      denops: args.denops,
      config,
      nodes,
      cmd: `+resize\\ ${row} `,
    },
  );

  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function openUiInput(
  args: ActionArgs,
  paramName: string,
  params: object,
): Promise<void> {
  const { denops } = args;
  const config = getBufferConfig("GitlaberUiInput");
  const bufnr = await createBuffer({ denops: args.denops, config, nodes: [] });
  const { name } = args;
  await updateBuffer({
    denops,
    bufnr,
    params: {
      actionName: name,
      paramName: paramName,
      actionParams: params ?? {},
    },
  });
}

export async function uiSelect(
  args: ActionArgs,
): Promise<void> {
  const { node, denops } = args;
  const ensuredAction = u.ensure(node?.params?.action, isAction);
  const { name, params } = ensuredAction;
  await fn.call(denops, "denops#notify", [
    "gitlaber",
    "doAction",
    [{
      name: name,
      params: params,
    }],
  ]);
  await fn.execute(denops, "bwipe");
}

export async function uiInput(
  args: ActionArgs,
): Promise<void> {
  const { denops } = args;
  const bufnr = await fn.bufnr(denops);
  const buffer = await getBuffer(denops, bufnr);
  const bufferParams = u.ensure(
    buffer.params,
    u.isObjectOf({
      actionName: u.isString,
      paramName: u.isString,
      actionParams: u.isOptionalOf(u.isObjectOf({
        ...u.isUnknown,
      })),
    }),
  );
  const lines = await flattenBuffer(denops, await fn.bufname(denops, bufnr));
  const { actionName, paramName, actionParams } = bufferParams;
  await fn.call(denops, "denops#notify", [
    "gitlaber",
    "doAction",
    [{
      name: actionName,
      params: {
        ...actionParams,
        [paramName]: lines,
      },
    }],
  ]);
  await fn.execute(denops, "bwipe");
}

export async function closeBuffer(args: ActionArgs): Promise<void> {
  await fn.execute(args.denops, "bwipe");
}
