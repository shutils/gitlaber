import { Denops, fn, helper, unknownutil as u } from "../deps.ts";

import { createBuffer, reRenderBuffer } from "./core.ts";
import { getBuffer, getCurrentInstance, updateBuffer } from "../helper.ts";
import {
  createContentNodes,
  createDescriptionNodes,
  createMainPanelNodes,
  createMergedYamlNodes,
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
import { ActionArgs, isAction, Node } from "../types.ts";
import { ensureIssue } from "../action/resource/issue.ts";
import { ensureMergeRequest } from "../action/resource/mr.ts";
import { ensureWiki } from "../action/resource/wiki.ts";
import { getLint } from "../client/index.ts";
import { flattenBuffer } from "../util.ts";

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
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
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
  const bufnr = await createBuffer(args.denops, config, nodes);
  await updateBuffer(args.denops, bufnr, undefined, { id, issue_iid });
}

export async function openBranchList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberBranchList");
  const nodes = await createProjectBranchesNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openBranchConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberBranchConfig");
  const nodes = await createProjectBranchPanelNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function openWikiList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiList");
  const nodes = await createProjectWikiNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openWikiConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiConfig");
  const nodes = await createProjectWikiPanelNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
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
  const bufnr = await createBuffer(args.denops, config, nodes);
  await updateBuffer(args.denops, bufnr, undefined, { id, slug, title });
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
  const bufnr = await createBuffer(args.denops, config, nodes);
  await updateBuffer(args.denops, bufnr, undefined, { id, title });
}

export async function openMrList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrList");
  const nodes = await createProjectMergeRequestsNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function openMrConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrConfig");
  const nodes = await createProjectMergeRequestPanelNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
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

export async function openUiSelect(
  args: ActionArgs,
  nodes: Node[],
): Promise<void> {
  const config = getBufferConfig("GitlaberUiSelect");
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function openMergedYaml(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const { url, token } = args.ctx;
  const { id } = args.ctx.instance.project;
  const content = await flattenBuffer(
    denops,
    await fn.bufname(denops, await fn.bufnr(denops)),
  );
  const config = getBufferConfig("GitlaberMergedYaml");
  const lint = await getLint(url, token, { id, content });
  if (!lint.valid) {
    await helper.echoerr(
      denops,
      `Invalid yaml. \n\nmessage: ${lint.errors.join("\n")}`,
    );
    return;
  }
  const nodes = await createMergedYamlNodes(lint);
  await createBuffer(args.denops, config, nodes);
}

export async function uiSelect(
  args: ActionArgs,
): Promise<void> {
  const { node, denops } = args;
  const ensuredAction = u.ensure(node?.params, isAction);
  const { name, params } = ensuredAction;
  await fn.call(denops, "denops#notify", [
    "gitlaber",
    "doAction",
    [{
      name: name,
      params: params,
    }],
  ]);
  await fn.execute(denops, "bwipe");
}

export async function openMrEdit(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrEdit");
  const mr = await ensureMergeRequest(args.denops, args);
  if (!mr) {
    return;
  }
  const nodes = await createDescriptionNodes(mr);
  const id = args.ctx.instance.project.id;
  const bufnr = await createBuffer(args.denops, config, nodes);
  await updateBuffer(args.denops, bufnr, undefined, {
    id,
    merge_request_iid: mr.iid,
  });
}

export async function openProjectStatus(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberProjectStatus");
  const nodes = await createMainPanelNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
}

export async function closeBuffer(args: ActionArgs): Promise<void> {
  await fn.execute(args.denops, "bwipe");
}

export async function nextList(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const buffer = await getBuffer(denops);
  const bufnr = await fn.bufnr(denops);

  // The operation will not be accepted if the end of kind in buffer is anything other than List.
  if (!/List$/.test(buffer.kind)) {
    helper.echoerr(denops, "This buffer is not supported for this operation.");
    return;
  }
  const params = u.ensure(
    buffer.params,
    u.isOptionalOf(u.isObjectOf({
      page: u.isOptionalOf(u.isNumber),
      per_page: u.isOptionalOf(u.isNumber),
      ...u.isUnknown,
    })),
  );
  let oldPage: number;
  let nextPage: number;
  if (!params || !params?.page) {
    nextPage = 2;
  } else {
    oldPage = params.page ?? 1;
    nextPage = oldPage + 1;
  }
  const updatedParams = {
    ...params,
    page: nextPage,
  };
  await updateBuffer(denops, bufnr, undefined, updatedParams);
  await reRenderBuffer(denops, bufnr);
}

export async function previousList(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const buffer = await getBuffer(denops);
  const bufnr = await fn.bufnr(denops);

  // The operation will not be accepted if the end of kind in buffer is anything other than List.
  if (!/List$/.test(buffer.kind)) {
    helper.echoerr(denops, "This buffer is not supported for this operation.");
    return;
  }
  const params = u.ensure(
    buffer.params,
    u.isOptionalOf(u.isObjectOf({
      page: u.isOptionalOf(u.isNumber),
      per_page: u.isOptionalOf(u.isNumber),
      ...u.isUnknown,
    })),
  );
  let oldPage: number;
  let previousPage: number;
  if (!params || !params?.page) {
    helper.echoerr(denops, "Previous page does not exist.");
    return;
  } else {
    oldPage = params.page ?? 1;
    previousPage = oldPage - 1;
  }
  const updatedParams = {
    ...params,
    page: previousPage,
  };
  await updateBuffer(denops, bufnr, undefined, updatedParams);
  await reRenderBuffer(denops, bufnr);
}
