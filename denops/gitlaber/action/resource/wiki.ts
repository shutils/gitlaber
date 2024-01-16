import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import { getCurrentNode } from "../../core.ts";
import { executeRequest } from "./main.ts";
import { doAction } from "../main.ts";
import { getBufferInfo } from "../../command/buffer/main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:resource:wiki:new": () => {
      doAction(denops, async (denops, _ctx) => {
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "openCreateNewProjectWikiBuf",
          [],
        ]);
      });
    },

    "action:resource:wiki:_new": () => {
      doAction(denops, async (denops, ctx) => {
        const { url, token, project } = ctx.instance;
        const bufinfo = await getBufferInfo(denops);
        const content = await util.flattenBuffer(
          denops,
          await fn.bufname(denops),
        );

        const title = bufinfo.params?.user_input?.title;
        if (!u.isString(title)) {
          helper.echo(denops, "Title has not been set.");
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
      });
    },

    "action:resource:wiki:prev": () => {
      doAction(denops, async (denops, _ctx) => {
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "openProjectWikiPreview",
          [],
        ]);
      });
    },

    "action:resource:wiki:edit": () => {
      doAction(denops, async (denops, _ctx) => {
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "openEditProjectWikiBuf",
          [],
        ]);
      });
    },

    "action:resource:wiki:_edit": () => {
      doAction(denops, async (denops, ctx) => {
        const { url, token, project } = ctx.instance;
        const content = await util.flattenBuffer(
          denops,
          await fn.bufname(denops),
        );
        const bufinfo = await getBufferInfo(denops);
        const title = bufinfo.params?.user_input?.title;
        const slug = bufinfo.params?.user_input?.slug;
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
      });
    },

    "action:resource:wiki:delete": () => {
      doAction(denops, async (denops, ctx) => {
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
      });
    },
  };
}
