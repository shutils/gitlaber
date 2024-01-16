import { Denops, helper } from "../../deps.ts";

import * as types from "../../types.ts";
import { getCtx, getCurrentNode } from "../../core.ts";
import { getBufferInfo } from "../buffer/main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async _getCurrentNode(): Promise<types.Node> {
      const ctx = await getCtx(denops);
      return await getCurrentNode(denops, ctx);
    },

    async echoKeymaps(): Promise<void> {
      const info = await getBufferInfo(denops);
      const keymaps = info.keymaps;
      const rows: string[] = [];
      const keyColumn = "Key(s)";
      const commandColumn = "Command";
      let maxLhsLength = keyColumn.length;

      for (const keymap of keymaps) {
        if (keymap.lhs.length > maxLhsLength) {
          maxLhsLength = keymap.lhs.length;
        }
      }

      // Add header
      const header = `${keyColumn}${
        " ".repeat(maxLhsLength - keyColumn.length + 1)
      } ${commandColumn}`;
      rows.push(header);

      // Add keymaps
      for (const keymap of keymaps) {
        rows.push(
          `${keymap.lhs}${
            " ".repeat(maxLhsLength + 1 - keymap.lhs.toString().length)
          } ${keymap.description}`,
        );
      }

      // Add separator
      const maxRowLength = Math.max(...rows.map((row) => row.length));
      rows.splice(1, 0, "-".repeat(maxRowLength));

      helper.echo(denops, rows.join("\n"));
    },
  };
}
