import { Denops, fn, helper } from "../deps.ts";

import { createBuffer, reRenderBuffer } from "./core.ts";
import { getCurrentInstance } from "../helper.ts";
import {
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
import { getBufferConfig, setBufferPramas } from "./helper.ts";
import { ActionArgs } from "../types.ts";
import { ensureIssue } from "../action/resource/issue.ts";

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
  await createBuffer(args.denops, config, nodes);
  await setBufferPramas(args.denops, await fn.bufnr(args.denops), {
    id: args.ctx.instance.project.id,
    issue_iid: issue.iid,
  });
  await fn.execute(
    args.denops,
    "autocmd BufWritePost <buffer> call denops#notify('gitlaber', 'editIssue', [bufnr()])",
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

export async function openProjectStatus(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberProjectStatus");
  const nodes = await createMainPanelNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}
