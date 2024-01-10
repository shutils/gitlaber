import { Denops, helper } from "../../deps.ts";
import * as util from "../../util.ts";
import * as types from "../../types.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async openBrowserProject(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.project.web_url;
      await util.openWithBrowser(denops, url);
    },

    async openBrowserNode(): Promise<void> {
      const currentNode = await util.getCurrentNode(denops);
      let url: string;

      if (types.isIssueNode(currentNode)) {
        url = currentNode.issue.web_url;
      } else if (types.isWikiNode(currentNode)) {
        const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
          denops,
        );
        const projectUrl = currentGitlaberInstance.project.web_url;
        const slug = currentNode.wiki.slug;
        url = projectUrl + "/-/wikis/" + slug;
      } else if (types.isBranchNode(currentNode)) {
        url = currentNode.branch.web_url;
      } else if (types.isMergeRequestNode(currentNode)) {
        url = currentNode.mr.web_url;
      } else {
        helper.echo(denops, "This node cannot be opened in a browser.");
        return;
      }

      await util.openWithBrowser(denops, url);
    },
  };
}
