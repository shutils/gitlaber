import { autocmd, Denops, fn, helper } from "../deps.ts";

import { createBuffer, reRenderBuffer } from "./core.ts";
import {
  addInstance,
  checkInstanceExists,
  getCurrentInstance,
  getCurrentNode,
  updateBuffer,
} from "../helper.ts";
import { validateNodeParams } from "../node/helper.ts";
import { isIssue, Issue, isWiki, Wiki } from "../types.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async "buffer:open:popup:main"(): Promise<void> {
      if (!await checkInstanceExists(denops)) {
        await addInstance(denops);
      }
      await createBuffer(denops, "GitlaberMain");
    },

    async "buffer:open:popup:issue"(): Promise<void> {
      await createBuffer(denops, "GitlaberPopupIssue");
    },

    async "buffer:open:resource:issues"(): Promise<void> {
      await createBuffer(denops, "GitlaberResourceIssues");
    },

    async "buffer:open:popup:branch"(): Promise<void> {
      await createBuffer(denops, "GitlaberPopupBranch");
    },

    async "buffer:open:resource:branches"(): Promise<void> {
      await createBuffer(denops, "GitlaberResourceBranches");
    },

    async "buffer:open:popup:wiki"(): Promise<void> {
      await createBuffer(denops, "GitlaberPopupWiki");
    },

    async "buffer:open:resource:wikis"(): Promise<void> {
      await createBuffer(denops, "GitlaberResourceWikis");
    },

    async "buffer:open:popup:mr"(): Promise<void> {
      await createBuffer(denops, "GitlaberPopupMr");
    },

    async "buffer:open:resource:mrs"(): Promise<void> {
      await createBuffer(denops, "GitlaberResourceMrs");
    },

    async "buffer:open:resource:wiki:new"(): Promise<void> {
      const title = await helper.input(denops, {
        prompt: "New wiki title: ",
      });
      if (!title) {
        return;
      }
      const bufnr = await createBuffer(denops, "GitlaberCreateWiki");
      if (!bufnr) {
        return;
      }
      await updateBuffer(denops, bufnr, [{
        display: "",
      }], {
        title: title,
      });
      const bufname = await fn.bufname(denops, bufnr);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call denops#notify('gitlaber', 'action:resource:wiki:_new', [])",
        );
      });
    },

    async "buffer:open:resource:wiki:prev"(): Promise<void> {
      await createBuffer(denops, "GitlaberPreviewWiki");
    },

    async "buffer:open:resource:wiki:edit"(): Promise<void> {
      const node = await getCurrentNode(denops);
      const wiki = node.params;
      if (!validateNodeParams<Wiki>(wiki, isWiki)) {
        return;
      }
      const title = wiki.title;
      const slug = wiki.slug;
      const bufnr = await createBuffer(denops, "GitlaberEditWiki");
      if (!bufnr) {
        return;
      }
      await updateBuffer(denops, bufnr, [{
        display: "",
      }], {
        title: title,
        slug: slug,
      });
      const bufname = await fn.bufname(denops, bufnr);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call denops#notify('gitlaber', 'action:resource:wiki:_edit', [])",
        );
      });
    },

    async "buffer:open:resource:issue:prev"(): Promise<void> {
      await createBuffer(denops, "GitlaberPreviewIssue");
    },

    async "buffer:open:resource:issue:edit"(): Promise<void> {
      const node = await getCurrentNode(denops);
      const issue = node.params;
      if (!validateNodeParams<Issue>(issue, isIssue)) {
        return;
      }
      const iid = issue.iid;
      const bufnr = await createBuffer(denops, "GitlaberEditIssue");
      if (!bufnr) {
        return;
      }
      await updateBuffer(denops, bufnr, [{
        display: "",
      }], {
        iid: iid,
      });
      const bufname = await fn.bufname(denops, bufnr);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call denops#notify('gitlaber', 'action:resource:issue:_edit', [])",
        );
      });
    },

    async "buffer:open:resource:mr:prev"(): Promise<void> {
      await createBuffer(denops, "GitlaberPreviewMr");
    },

    async "command:buffer:autoreload"(): Promise<void> {
      const instance = await getCurrentInstance(denops);
      const bufnrs = instance.bufnrs;
      bufnrs.forEach(async (bufnr) => {
        await reRenderBuffer(denops, bufnr);
      });
    },
  };
}
