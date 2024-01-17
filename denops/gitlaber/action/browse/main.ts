import { Denops, helper } from "../../deps.ts";
import { doAction } from "../main.ts";
import { getCurrentNode } from "../../helper.ts";
import {
  isBranch,
  isIssue,
  isMergeRequest,
  isWiki,
} from "../../types.ts";
import { openWithBrowser } from "./core.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:browse:project": () => {
      doAction(denops, async (denops, ctx) => {
        await openWithBrowser(denops, ctx.instance.project.web_url);
      });
    },

    "action:browse:node": () => {
      doAction(denops, async (denops, ctx) => {
        const currentNode = await getCurrentNode(denops, ctx);
        let url: string;

        if (isIssue(currentNode.resource)) {
          url = currentNode.resource.web_url;
        } else if (isWiki(currentNode.resource)) {
          const slug = currentNode.resource.slug;
          url = ctx.instance.url + "/-/wikis/" + slug;
        } else if (isBranch(currentNode.resource)) {
          url = currentNode.resource.web_url;
        } else if (isMergeRequest(currentNode.resource)) {
          url = currentNode.resource.web_url;
        } else {
          helper.echo(denops, "This node cannot be opened in a browser.");
          helper.echo(
            denops,
            Deno.inspect(currentNode.resource, { depth: Infinity }),
          );
          return;
        }

        await openWithBrowser(denops, url);
      });
    },
  };
}
