import { fn, helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import {
  ActionArgs,
  isIssue,
  isProjectLabel,
  Issue,
  Node,
  ProjectLabel,
} from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";
import { getBuffer, updateBuffer } from "../../helper.ts";
import { openUiSelect } from "../ui/main.ts";
import { getBufferConfig } from "../../helper.ts";
import { createBuffer } from "../../buffer/core.ts";
import {
  createDescriptionNodes,
  createIssuePanelNodes,
  createIssuesNodes,
} from "../../node/main.ts";
import {
  argsHasAssignee,
  getAssigneeFromArgs,
  selectAssignee,
  selectLabel,
} from "./common.ts";

export async function openIssueList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberIssueList");
  const nodes = await createIssuesNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await util.focusBuffer(args.denops, bufnr);
}

export async function openIssueConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberIssueConfig");
  const nodes = await createIssuePanelNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function openIssuePreview(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberIssuePreview");
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
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
  const { denops } = args;
  const config = getBufferConfig("GitlaberIssueEdit");
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  const nodes = await createDescriptionNodes(issue);
  const id = args.ctx.instance.project.id;
  const issue_iid = issue.iid;
  const bufnr = await createBuffer(args.denops, config, nodes);
  await updateBuffer({ denops, bufnr, params: { id, issue_iid } });
}

export async function createIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const id = instance.project.id;
  const title = await helper.input(denops, {
    prompt: "New issue title: ",
  });
  if (!title) {
    return;
  }
  await executeRequest(denops, client.createProjectIssue, url, token, {
    id,
    title,
  }, "Successfully created an issue.");
}

export async function editIssueDescription(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const bufnr = await fn.bufnr(denops);
  const buffer = await getBuffer(denops, bufnr);
  const bufferParams = u.ensure(
    buffer.params,
    u.isObjectOf({
      id: u.isNumber,
      issue_iid: u.isNumber,
    }),
  );
  const { id, issue_iid } = bufferParams;

  const lines = await util.flattenBuffer(
    denops,
    await fn.bufname(denops, bufnr),
  );
  await executeRequest(denops, client.editProjectIssue, ctx.url, ctx.token, {
    id: id,
    issue_iid: issue_iid,
    description: lines,
  }, "Successfully updated an issue.");
}

export async function deleteIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to delete the issue(${issue.iid})? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(denops, client.deleteProjectIssue, url, token, {
    id: instance.project.id,
    issue_iid: issue.iid,
  }, "Successfully delete an issue.");
}

export async function closeIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  await executeRequest(denops, client.editProjectIssue, url, token, {
    id: instance.project.id,
    issue_iid: issue.iid,
    state_event: "close",
  }, "Successfully close an issue.");
}

export async function reopenIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  await executeRequest(denops, client.editProjectIssue, url, token, {
    id: instance.project.id,
    issue_iid: issue.iid,
    state_event: "reopen",
  }, "Successfully reopen an issue.");
}

export async function labelIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx, params } = args;
  const { url, token, instance } = ctx;
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  let label: ProjectLabel;
  if (isProjectLabel(params?.label)) {
    label = params.label;
  } else {
    selectLabel(args);
    return;
  }
  const id = instance.project.id;
  const add_labels = label.name;
  await executeRequest(denops, client.editProjectIssue, url, token, {
    id,
    issue_iid: issue.iid,
    add_labels,
  }, "Successfully add a label.");
}

export async function unlabelIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx, params } = args;
  const { url, token, instance } = ctx;
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  let label: string;
  if (u.isString(params?.label)) {
    label = params.label;
  } else {
    selectLabelFromIssue(args, issue);
    return;
  }
  const id = instance.project.id;
  await executeRequest(denops, client.editProjectIssue, url, token, {
    id,
    issue_iid: issue.iid,
    remove_labels: label,
  }, "Successfully remove a label.");
}

export async function browseIssue(args: ActionArgs): Promise<void> {
  const { denops } = args;
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  await openWithBrowser(denops, issue.web_url);
}

export async function assignIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  let issue: Issue;
  if (argsHasIssue(args)) {
    issue = getIssueFromArgs(args);
  } else {
    selectIssue(args);
    return;
  }
  let assignee_id: number;
  if (argsHasAssignee(args)) {
    assignee_id = getAssigneeFromArgs(args);
  } else {
    selectAssignee(args);
    return;
  }
  const id = instance.project.id;
  await executeRequest(denops, client.editProjectIssue, url, token, {
    id,
    issue_iid: issue.iid,
    assignee_ids: [assignee_id],
  }, "Successfully assign a issue.");
}

async function selectIssue(args: ActionArgs): Promise<void> {
  const { url, token, instance } = args.ctx;
  const id = instance.project.id;
  const issues = await client.getProjectIssues(url, token, { id });
  const nodes: Node[] = [];
  issues.map((issue) => {
    nodes.push({
      display: `#${issue.iid} ${issue.title}`,
      params: {
        action: {
          name: args.name,
          params: { ...args.params, issue: issue },
        },
      },
    });
  });
  await openUiSelect(args, nodes);
}

async function selectLabelFromIssue(
  args: ActionArgs,
  issue: Issue,
): Promise<void> {
  const { denops } = args;
  const labels = issue.labels;
  if (labels.length === 0) {
    helper.echo(denops, "This issue has not labels.");
    return;
  }
  const nodes: Node[] = [];
  labels.map((label) => {
    nodes.push({
      display: label,
      params: {
        action: {
          name: args.name,
          params: { ...args.params, label: label },
        },
      },
    });
  });
  await openUiSelect(args, nodes);
}

function argsHasIssue(args: ActionArgs): boolean {
  if (isIssue(args.params?.issue)) {
    return true;
  } else if (isIssue(args.node?.params?.issue)) {
    return true;
  }
  return false;
}

function getIssueFromArgs(args: ActionArgs): Issue {
  if (isIssue(args.params?.issue)) {
    return args.params.issue;
  } else if (isIssue(args.node?.params?.issue)) {
    return args.node.params.issue;
  }
  throw new Error("Issue not found.");
}
