import { Denops, helper } from "../../deps.ts";
import { doAction } from "../main.ts";
import { getBufferInfo } from "../../command/buffer/main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:common:echo:node": () => {
      doAction(denops, async (denops, ctx) => {
        await helper.echo(denops, Deno.inspect(ctx, { depth: Infinity }));
      });
    },

    "action:common:echo:keymaps": () => {
      doAction(denops, async (denops, _ctx) => {
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

        await helper.echo(denops, rows.join("\n"));
      });
    },
  };
}
