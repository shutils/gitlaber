import { Denops } from "../../deps.ts";

import * as util from "../../util.ts";
import * as types from "../../types.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async _getCurrentNode(): Promise<types.BaseNode | types.IssueNode> {
      const currentNode = await util.getCurrentNode(denops);
      return currentNode;
    },
  };
}
