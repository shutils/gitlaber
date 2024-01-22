import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import { isWiki } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { doAction } from "../main.ts";
import { flattenBuffer } from "../../util.ts";
import {
  getBuffer,
  getCurrentInstance,
  getGitlabToken,
  getGitlabUrl,
} from "../../helper.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:resource:wiki:new": () => {
      doAction(denops, async (args) => {
        const { denops } = args;
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "command:buffer:open:resource:wiki:new",
          [],
        ]);
      });
    },

    "action:resource:wiki:_new": async () => {
      const instance = await getCurrentInstance(denops);
      const url = getGitlabUrl(instance.cwd);
      const token = getGitlabToken(instance.cwd);
      const content = await flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const buffer = await getBuffer(denops, await fn.bufnr(denops));
      const params = buffer?.params;
      if (
        !u.isObjectOf({
          title: u.isString,
        })(params)
      ) {
        helper.echo(denops, "Title has not been set.");
        return;
      }

      const title = params.title;
      await executeRequest(
        denops,
        client.requestCreateNewProjectWiki,
        url,
        token,
        {
          id: instance.project.id,
          title: title,
          content: content,
        },
        "Successfully created a new wiki.",
      );
    },

    "action:resource:wiki:prev": () => {
      doAction(denops, async (args) => {
        const { denops } = args;
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "command:buffer:open:resource:wiki:prev",
          [],
        ]);
      });
    },

    "action:resource:wiki:edit": () => {
      doAction(denops, async (args) => {
        const { denops } = args;
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "command:buffer:open:resource:wiki:edit",
          [],
        ]);
      });
    },

    "action:resource:wiki:_edit": async () => {
      const instance = await getCurrentInstance(denops);
      const url = getGitlabUrl(instance.cwd);
      const token = getGitlabToken(instance.cwd);
      const content = await flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const buffer = await getBuffer(denops, await fn.bufnr(denops));
      const params = buffer?.params;
      if (
        !u.isObjectOf({
          title: u.isString,
          slug: u.isString,
        })(params)
      ) {
        helper.echo(denops, "Title has not been set.");
        return;
      }
      const title = params.title;
      const slug = params.slug;
      if (!u.isString(title)) {
        return;
      }
      if (!u.isString(slug)) {
        return;
      }
      let commitMessage = await helper.input(denops, {
        prompt: `Please enter your commit message: `,
        text: `Update ${title}`,
      });
      if (!u.isString(commitMessage)) {
        commitMessage = "";
      }
      await executeRequest(
        denops,
        client.editProjectWiki,
        url,
        token,
        {
          id: instance.project.id,
          title: title,
          content: content,
          slug: slug,
          message: commitMessage,
        },
        "Successfully edit a wiki.",
      );
    },

    "action:resource:wiki:delete": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const wiki = u.ensure(node.params, isWiki);
        const slug = wiki.slug;
        const title = wiki.title;
        const confirm = await helper.input(denops, {
          prompt: `Are you sure you want to delete the wiki(${title})? y/N: `,
        });
        if (confirm !== "y") {
          return;
        }
        await executeRequest(
          denops,
          client.deleteProjectWiki,
          url,
          token,
          {
            id: instance.project.id,
            slug: slug,
          },
          "Successfully delete a wiki.",
        );
      });
    },
  };
}
