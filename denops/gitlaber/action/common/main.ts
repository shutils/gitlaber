import { helper } from "../../deps.ts";

import { ActionArgs } from "../../types.ts";

export async function echoNode(args: ActionArgs): Promise<void> {
  const { denops, node } = args;
  if (!node) {
    await helper.echo(denops, "This line is not node.");
    return;
  }
  await helper.echo(denops, Deno.inspect(node, { depth: Infinity }));
}
