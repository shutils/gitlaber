import { autocmd, Denops, fn, helper, unknownutil, vars } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import {
  getCtx,
  getCurrentGitlaberInstance,
  updateGitlaberInstanceRecentResource,
} from "../../core.ts";

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
      try {
        await client.requestCreateNewProjectWiki(url, token, {
          id: project.id,
          title: title,
          content: content,
        });
        helper.echo(denops, "Successfully create a new wiki.");
        await updateGitlaberInstanceRecentResource(denops, "wiki");
        autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
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
      try {
        await client.requestEditWiki(url, token, {
          id: project.id,
          title: title,
          content: content,
          slug: slug,
          message: commitMessage,
        });
        helper.echo(denops, "Successfully edit a wiki.");
        await updateGitlaberInstanceRecentResource(denops, "wiki");
        autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async deleteProjectWiki(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!("wiki" in current_node)) {
        return;
      }
      const slug = current_node.wiki.slug;
      const title = current_node.wiki.title;
      const confirm = await helper.input(denops, {
        prompt: `Are you sure you want to delete the wiki(${title})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        await client.requestDeleteWiki(instance.url, instance.token, {
          id: instance.project.id,
          slug: slug,
        });
        helper.echo(denops, "Successfully delete a wiki.");
        await updateGitlaberInstanceRecentResource(denops, "wiki");
        autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },
  };
}
