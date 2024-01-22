import { Denops, helper } from "../../deps.ts";
import { doAction } from "../main.ts";
import { isBranch, isIssue, isMergeRequest, isWiki } from "../../types.ts";
import { openWithBrowser } from "./core.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:browse:project": () => {
      doAction(denops, async (args) => {
        const { denops, instance } = args;
        await openWithBrowser(denops, instance.project.web_url);
      });
    },

    "action:browse:node": () => {
      doAction(denops, async (args) => {
        const { node, url } = args;
        let openUrl: string;

        if (isIssue(node.params)) {
          openUrl = node.params.web_url;
        } else if (isWiki(node.params)) {
          const slug = node.params.slug;
          openUrl = url + "/-/wikis/" + slug;
        } else if (isBranch(node.params)) {
          openUrl = node.params.web_url;
        } else if (isMergeRequest(node.params)) {
          openUrl = node.params.web_url;
        } else {
          helper.echo(denops, "This node cannot be opened in a browser.");
          helper.echo(
            denops,
            Deno.inspect(node.params, { depth: Infinity }),
          );
          return;
        }

        await openWithBrowser(denops, openUrl);
      });
    },
  };
}
