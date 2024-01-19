import { Denops, helper } from "../../deps.ts";

import { getBuffer } from "../../helper.ts";
import { getBufferConfig } from "../../buffer/helper.ts";
import { doAction } from "../main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:common:echo:node": () => {
      doAction(denops, async (args) => {
        const { denops, node } = args;
        await helper.echo(denops, Deno.inspect(node, { depth: Infinity }));
      });
    },

    "action:common:echo:keymaps": () => {
      doAction(denops, async (args) => {
        const { denops } = args;
        const buffer = await getBuffer(denops);
        const config = getBufferConfig(buffer.kind);
        const keymaps = config.keymaps;
        if (!keymaps) {
          helper.echo(denops, "This buffer has no keymaps.");
          return;
        }
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

        await helper.echo(denops, rows.join("\n"));
      });
    },
  };
}
