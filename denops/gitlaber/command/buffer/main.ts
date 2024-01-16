import { autocmd, Denops, fn, helper, unknownutil as u } from "../../deps.ts";

import * as types from "../../types.ts";
import * as client from "../../client/index.ts";
import {
  getCtx,
  getCurrentGitlaberInstance,
  getCurrentNode,
  getGitlaberVar,
  setCtx,
  setGitlaberVar,
} from "../../core.ts";
import { selectBufferInfo } from "./config.ts";
import { renderBuffer, reRenderBuffer } from "./core.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async openGitlaber(): Promise<void> {
      const cwd = await fn.getcwd(denops);
      const url = client.getGitlabUrl(cwd);
      const token = client.getGitlabToken(cwd);
      const singleProject = await client.getSingleProject(url, token, cwd);
      const gitlaberVar = await getGitlaberVar(denops);
      const bufnr = await fn.bufnr(denops);
      try {
        await getCurrentGitlaberInstance(denops);
      } catch {
        const currentGitlaberInstance: types.GitlaberInstance = {
          cwd: cwd,
          project: singleProject,
          url: url,
          token: token,
          buffers: [{ resource_kind: "other", bufnr: bufnr }],
        };
        gitlaberVar.instances.push(currentGitlaberInstance);
        await setGitlaberVar(denops, gitlaberVar);
      }
      await setCtx(denops, {
        instance: await getCurrentGitlaberInstance(denops),
        nodes: [],
      }, bufnr);
      await renderBuffer(denops, selectBufferInfo("main"));
    },

    async openProjectIssuePanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_issue"));
    },

    async openProjectIssuesPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_issues"));
    },

    async openProjectBranchPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_branch"));
    },

    async openProjectBranchesPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_branches"));
    },

    async openProjectWikiPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_wiki"));
    },

    async openProjectWikisPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_wikis"));
    },

    async openProjectMergeRequestPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_merge_request"));
    },

    async openProjectMergeRequestsPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_merge_requests"));
    },

    async openCreateNewProjectWikiBuf(): Promise<void> {
      const title = await helper.input(denops, {
        prompt: "New wiki title: ",
      });
      if (!title) {
        return;
      }
      const bufinfo = selectBufferInfo("wiki_create");
      bufinfo.autocmd = async (params) => {
        const bufname = params?.bufname;
        if (!bufname) {
          helper.echoerr(denops, "bufname is not set");
          return;
        }
        if (!u.isString(bufname)) {
          helper.echoerr(denops, "bufname is not string");
          return;
        }
        await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
          helper.remove("BufWritePost");
          helper.define(
            "BufWritePost",
            bufname,
            "call denops#notify('gitlaber', 'action:resource:wiki:_new', [])",
          );
        });
      };
      bufinfo.params = {
        user_input: {
          title: title,
        },
      };
      await renderBuffer(denops, bufinfo);
    },

    async openProjectWikiPreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isWiki(currentNode.resource))) {
        helper.echo(denops, "This node is not a wiki.");
        return;
      }
      await renderBuffer(denops, selectBufferInfo("wiki_preview"));
    },

    async openEditProjectWikiBuf(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isWiki(currentNode.resource))) {
        helper.echo(denops, "This node is not a wiki.");
        return;
      }
      const title = currentNode.resource.title;
      const slug = currentNode.resource.slug;
      const bufinfo = selectBufferInfo("wiki_edit");
      bufinfo.autocmd = async (params) => {
        const bufname = params?.bufname;
        if (!bufname) {
          helper.echoerr(denops, "bufname is not set");
          return;
        }
        if (!u.isString(bufname)) {
          helper.echoerr(denops, "bufname is not string");
          return;
        }
        await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
          helper.remove("BufWritePost");
          helper.define(
            "BufWritePost",
            bufname,
            "call denops#notify('gitlaber', 'action:resource:wiki:_edit', [])",
          );
        });
      };
      bufinfo.params = {
        user_input: {
          title: title,
          slug: slug,
        },
      };
      await renderBuffer(denops, bufinfo);
    },

    async openProjectIssuePreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isIssue(currentNode.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      if (currentNode.resource.description == null) {
        helper.echo(denops, "This issue does not have a description.");
        return;
      }
      await renderBuffer(denops, selectBufferInfo("issue_preview"));
    },

    async openProjectIssueEditBuf(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isIssue(currentNode.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const iid = currentNode.resource.iid;
      const bufinfo = selectBufferInfo("issue_edit");
      bufinfo.autocmd = async (params) => {
        const bufname = params?.bufname;
        if (!bufname) {
          helper.echoerr(denops, "bufname is not set");
          return;
        }
        if (!u.isString(bufname)) {
          helper.echoerr(denops, "bufname is not string");
          return;
        }
        await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
          helper.remove("BufWritePost");
          helper.define(
            "BufWritePost",
            bufname,
            "call denops#notify('gitlaber', 'action:resource:issue:_edit', [])",
          );
        });
      };
      bufinfo.params = {
        user_input: {
          iid: iid,
        },
      };
      await renderBuffer(denops, bufinfo);
    },

    async openProjectMergeRequestPreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isMergeRequest(currentNode.resource))) {
        helper.echo(denops, "This node is not a merge request.");
        return;
      }
      if (currentNode.resource.description == null) {
        helper.echo(denops, "This merge request does not have a description.");
        return;
      }
      await renderBuffer(denops, selectBufferInfo("merge_request_preview"));
    },

    async reloadBuffer(bufnr: unknown): Promise<void> {
      if (!u.isNumber(bufnr)) {
        return;
      }
      await reRenderBuffer(denops, bufnr);
    },

    async updateResourceBuffer(): Promise<void> {
      const gitlaberVar = await getGitlaberVar(denops);
      const recentInstance = gitlaberVar.recent_instance_index;
      const instance = gitlaberVar.instances[recentInstance];
      const recentResource = instance.recent_resource;
      if (!recentResource) {
        return;
      }
      const targetBuffers = instance.buffers.filter((buffer) =>
        buffer.resource_kind === recentResource
      );
      targetBuffers.forEach(async (buffer) => {
        await reRenderBuffer(denops, buffer.bufnr);
      });
    },
  };
}
