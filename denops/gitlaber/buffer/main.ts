import { Denops, fn, helper } from "../deps.ts";

import { createBuffer, reRenderBuffer } from "./core.ts";
import { getCurrentInstance } from "../helper.ts";
import {
  createContentNodes,
  createDescriptionNodes,
  createMainPanelNodes,
  createProjectBranchesNodes,
  createProjectBranchPanelNodes,
  createProjectIssuePanelNodes,
  createProjectIssuesNodes,
  createProjectMergeRequestPanelNodes,
  createProjectMergeRequestsNodes,
  createProjectWikiNodes,
  createProjectWikiPanelNodes,
} from "../node/main.ts";
import { getBufferConfig } from "./helper.ts";
import { ActionArgs } from "../types.ts";
import { ensureIssue } from "../action/resource/issue.ts";
import { ensureMergeRequest } from "../action/resource/mr.ts";
import { ensureWiki } from "../action/resource/wiki.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async "command:buffer:autoreload"(): Promise<void> {
      const instance = await getCurrentInstance(denops);
      const bufnrs = instance.bufnrs;
      bufnrs.forEach(async (bufnr) => {
        await reRenderBuffer(denops, bufnr);
      });
    },
  };
}

export async function openIssueList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberIssueList");
  const nodes = await createProjectIssuesNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openIssueConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberIssueConfig");
  const nodes = await createProjectIssuePanelNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openIssuePreview(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberIssuePreview");
  const issue = await ensureIssue(args.denops, args);
  if (!issue) {
    return;
  }
  if (issue.description === null) {
    await helper.echo(args.denops, "This issue has not description.");
    return;
  }
  const nodes = await createDescriptionNodes(issue);
  await createBuffer(args.denops, config, nodes);
}

export async function openIssueEdit(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberIssueEdit");
  const issue = await ensureIssue(args.denops, args);
  if (!issue) {
    return;
  }
  const nodes = await createDescriptionNodes(issue);
  const id = args.ctx.instance.project.id;
  const issue_iid = issue.iid;
  await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd BufWritePost <buffer> call denops#notify('gitlaber', 'doAction', [{'name': 'issue:_edit', 'params': { 'bufnr': bufnr(), 'id': ${id}, 'issue_iid': ${issue_iid} }}])`,
  );
}

export async function openBranchList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberBranchList");
  const nodes = await createProjectBranchesNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openBranchConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberBranchConfig");
  const nodes = await createProjectBranchPanelNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openWikiList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiList");
  const nodes = await createProjectWikiNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openWikiConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiConfig");
  const nodes = await createProjectWikiPanelNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openWikiPreview(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiPreview");
  const wiki = await ensureWiki(args.denops, args);
  if (!wiki) {
    return;
  }
  const nodes = await createContentNodes(wiki);
  await createBuffer(args.denops, config, nodes);
}

export async function openWikiEdit(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiEdit");
  const wiki = await ensureWiki(args.denops, args);
  if (!wiki) {
    return;
  }
  const id = args.ctx.instance.project.id;
  const slug = wiki.slug;
  const title = wiki.title;
  const nodes = await createContentNodes(wiki);
  await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd BufWritePost <buffer> call denops#notify('gitlaber', 'doAction', [{'name': 'wiki:_edit', 'params': { 'bufnr': bufnr(), 'id': ${id}, 'slug': '${slug}', 'title': '${title}' }}])`,
  );
}

export async function openWikiNew(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiNew");
  const id = args.ctx.instance.project.id;
  const title = await helper.input(args.denops, {
    prompt: "New wiki title: ",
  });
  if (!title) {
    return;
  }
  const nodes = await createContentNodes({ title, content: "" });
  await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd BufWritePost <buffer> call denops#notify('gitlaber', 'doAction', [{'name': 'wiki:_new', 'params': { 'bufnr': bufnr(), 'id': ${id}, 'title': '${title}' }}])`,
  );
}

export async function openMrList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrList");
  const nodes = await createProjectMergeRequestsNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openMrConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrConfig");
  const nodes = await createProjectMergeRequestPanelNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openMrPreview(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrPreview");
  const mr = await ensureMergeRequest(args.denops, args);
  if (!mr) {
    return;
  }
  if (mr.description === null) {
    await helper.echo(args.denops, "This merge request has not description.");
    return;
  }
  const nodes = await createDescriptionNodes(mr);
  await createBuffer(args.denops, config, nodes);
}

export async function openMrEdit(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrEdit");
  const mr = await ensureMergeRequest(args.denops, args);
  if (!mr) {
    return;
  }
  const nodes = await createDescriptionNodes(mr);
  const id = args.ctx.instance.project.id;
  await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd BufWritePost <buffer> call denops#notify('gitlaber', 'doAction', [{'name': 'mr:_edit', 'params': { 'bufnr': bufnr(), 'id': ${id}, 'merge_request_iid': ${mr.iid} }}])`,
  );
}

export async function openProjectStatus(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberProjectStatus");
  const nodes = await createMainPanelNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}
