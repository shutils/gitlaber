import { Denops, fn, helper, unknownutil, vars } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import {
  getCtx,
  getCurrentGitlaberInstance,
  getCurrentNode,
} from "../../core.ts";
import { executeRequest } from "./main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async createProjectNewWiki(): Promise<void> {
      const { url, token, project } = await getCurrentGitlaberInstance(
        denops,
      );
      const content = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const title = await vars.b.get(denops, "gitlaber_new_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      await executeRequest(
        denops,
        client.requestCreateNewProjectWiki,
        url,
        token,
        {
          id: project.id,
          title: title,
          content: content,
        },
        "Successfully created a new wiki.",
        "wiki",
      );
    },

    async editProjectWiki(): Promise<void> {
      const { url, token, project } = await getCurrentGitlaberInstance(
        denops,
      );
      const content = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const title = await vars.b.get(denops, "gitlaber_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      const slug = await vars.b.get(denops, "gitlaber_wiki_slug");
      if (!unknownutil.isString(slug)) {
        return;
      }
      let commitMessage = await helper.input(denops, {
        prompt: `Please enter your commit message: `,
        text: `Update ${title}`,
      });
      if (!unknownutil.isString(commitMessage)) {
        commitMessage = "";
      }
      await executeRequest(
        denops,
        client.requestEditWiki,
        url,
        token,
        {
          id: project.id,
          title: title,
          content: content,
          slug: slug,
          message: commitMessage,
        },
        "Successfully edit a wiki.",
        "wiki",
      );
    },

    async deleteProjectWiki(): Promise<void> {
      const ctx = await getCtx(denops);
      const { instance } = ctx;
      const currentNode = await getCurrentNode(denops, ctx);
      if (!("wiki" in currentNode)) {
        return;
      }
      if (!(client.isWiki(currentNode.resource))) {
        helper.echo(denops, "This node is not a wiki.");
        return;
      }
      const slug = currentNode.resource.slug;
      const title = currentNode.resource.title;
      const confirm = await helper.input(denops, {
        prompt: `Are you sure you want to delete the wiki(${title})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      await executeRequest(
        denops,
        client.requestDeleteWiki,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          slug: slug,
        },
        "Successfully delete a wiki.",
        "wiki",
      );
    },
  };
}
