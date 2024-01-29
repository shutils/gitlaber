import { fn, unknownutil as u } from "../../deps.ts";

import { createBuffer } from "../../buffer/core.ts";
import { getBufferConfig } from "../../helper.ts";
import { ActionArgs, isAction, Node } from "../../types.ts";

export async function openUiSelect(
  args: ActionArgs,
  nodes: Node[],
): Promise<void> {
  const config = getBufferConfig("GitlaberUiSelect");
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function uiSelect(
  args: ActionArgs,
): Promise<void> {
  const { node, denops } = args;
  const ensuredAction = u.ensure(node?.params, isAction);
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

export async function closeBuffer(args: ActionArgs): Promise<void> {
  await fn.execute(args.denops, "bwipe");
}
