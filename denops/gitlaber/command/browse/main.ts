import { Denops, helper } from "../../deps.ts";
import * as util from "../../util.ts";

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

    async openBrowserIssue(): Promise<void> {
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        helper.echoerr(denops, "This node is not issue.");
        return;
      }
      const url = currentNode.issue.web_url;
      await util.openWithBrowser(denops, url);
    },

    async openBrowserWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("wiki" in currentNode)) {
        helper.echoerr(denops, "This node is not wiki.");
        return;
      }
      const projectUrl = currentGitlaberInstance.project.web_url;
      const slug = currentNode.wiki.slug;
      const url = projectUrl + "/-/wikis/" + slug;
      await util.openWithBrowser(denops, url);
    },
  };
}
