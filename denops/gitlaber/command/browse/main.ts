import { Denops, helper } from "../../deps.ts";
import * as util from "../../util.ts";
import { getCtx } from "../../core.ts";
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
      const { current_node } = ctx;
      let url: string;

      if (isIssue(current_node.resource)) {
        url = current_node.resource.web_url;
      } else if (isWiki(current_node.resource)) {
        const slug = current_node.resource.slug;
        url = ctx.instance.url + "/-/wikis/" + slug;
      } else if (isBranch(current_node.resource)) {
        url = current_node.resource.web_url;
      } else if (isMergeRequest(current_node.resource)) {
        url = current_node.resource.web_url;
      } else {
        helper.echo(denops, "This node cannot be opened in a browser.");
        helper.echo(
          denops,
          Deno.inspect(current_node.resource, { depth: Infinity }),
        );
        return;
      }

      await util.openWithBrowser(denops, url);
    },
  };
}
