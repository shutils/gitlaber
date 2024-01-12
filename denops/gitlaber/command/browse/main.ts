import { Denops, helper } from "../../deps.ts";
import * as util from "../../util.ts";
import * as types from "../../types.ts";
import { getCtx } from "../../core.ts";

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

      if (types.isIssueNode(current_node)) {
        url = current_node.issue.web_url;
      } else if (types.isWikiNode(current_node)) {
        const slug = current_node.wiki.slug;
        url = ctx.instance.url + "/-/wikis/" + slug;
      } else if (types.isBranchNode(current_node)) {
        url = current_node.branch.web_url;
      } else if (types.isMergeRequestNode(current_node)) {
        url = current_node.mr.web_url;
      } else {
        helper.echo(denops, "This node cannot be opened in a browser.");
        return;
      }

      await util.openWithBrowser(denops, url);
    },
  };
}
