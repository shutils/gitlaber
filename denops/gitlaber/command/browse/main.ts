import { Denops, helper } from "../../deps.ts";
import * as util from "../../util.ts";
import { getCtx, getCurrentNode } from "../../core.ts";
import {
  isBranch,
  isIssue,
  isMergeRequest,
  isWiki,
} from "../../client/index.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async openBrowserProject(): Promise<void> {
      const ctx = await getCtx(denops);
      await util.openWithBrowser(denops, ctx.instance.project.web_url);
    },

    async openBrowserNode(): Promise<void> {
      const ctx = await getCtx(denops);
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

      await util.openWithBrowser(denops, url);
    },
  };
}
