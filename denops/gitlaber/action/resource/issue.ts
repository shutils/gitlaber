import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import { ActionArgs, isIssue, Node } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";
import { openUiSelect } from "../../buffer/main.ts";

export async function createIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const project = instance.project;
  const title = await helper.input(denops, {
    prompt: "New issue title: ",
  });
  if (!title) {
    return;
  }
  await executeRequest(
    denops,
    client.createProjectIssue,
    url,
    token,
    {
      id: project.id,
      title: title,
    },
    "Successfully created an issue.",
  );
}

export async function editIssueDescription(args: ActionArgs): Promise<void> {
  const { denops, params, ctx } = args;
  const actionParams = u.ensure(
    params,
    u.isObjectOf({
      bufnr: u.isNumber,
      id: u.isNumber,
      issue_iid: u.isNumber,
    }),
  );
  const { bufnr, id, issue_iid } = actionParams;

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
  const issue = await ensureIssue(denops, args);
  if (!issue) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to delete the issue(${issue.iid})? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(
    denops,
    client.deleteProjectIssue,
    url,
    token,
    {
      id: instance.project.id,
      issue_iid: issue.iid,
    },
    "Successfully delete an issue.",
  );
}

export async function closeIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const issue = await ensureIssue(denops, args);
  if (!issue) {
    return;
  }
  let stateEvent: "close" | "reopen" = "close";
  if (issue.state === "closed") {
    stateEvent = "reopen";
  }
  await executeRequest(
    denops,
    client.editProjectIssue,
    url,
    token,
    {
      id: instance.project.id,
      issue_iid: issue.iid,
      state_event: stateEvent,
    },
    "Successfully close an issue.",
  );
}

export async function reopenIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const issue = await ensureIssue(denops, args);
  if (!issue) {
    return;
  }
  await executeRequest(
    denops,
    client.editProjectIssue,
    url,
    token,
    {
      id: instance.project.id,
      issue_iid: issue.iid,
      state_event: "reopen",
    },
    "Successfully reopen an issue.",
  );
}

export async function labelIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx, params } = args;
  const { url, token, instance } = ctx;
  const ensuredParams = u.ensure(
    params,
    u.isOptionalOf(u.isObjectOf({
      id: u.isOptionalOf(u.isNumber),
      issue_iid: u.isOptionalOf(u.isNumber),
      add_labels: u.isOptionalOf(u.isString),
    })),
  );
  const id = instance.project.id;
  let issue_iid = ensuredParams?.issue_iid;
  const add_labels = ensuredParams?.add_labels;
  if (!issue_iid) {
    const issue = await ensureIssue(denops, args);
    if (!issue) {
      return;
    }
    issue_iid = issue.iid;
  }
  const labels = await client.getProjectLabels(
    url,
    token,
    {
      id,
    },
  );
  if (labels.length === 0) {
    helper.echo(denops, "Project has not labels.");
    return;
  }
  if (!add_labels) {
    const nodes: Node[] = [];
    labels.map((label) => {
      nodes.push({
        display: label.name,
        params: {
          name: args.name,
          params: { ...params, id, issue_iid, add_labels: label.name },
        },
      });
    });
    await openUiSelect(args, nodes);
    return;
  }
  await executeRequest(
    denops,
    client.editProjectIssue,
    url,
    token,
    {
      id,
      issue_iid,
      add_labels,
    },
    "Successfully add a label.",
  );
}

export async function unlabelIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx, params } = args;
  const { url, token, instance } = ctx;
  const ensuredParams = u.ensure(
    params,
    u.isOptionalOf(u.isObjectOf({
      id: u.isOptionalOf(u.isNumber),
      issue: u.isOptionalOf(isIssue),
      remove_labels: u.isOptionalOf(u.isString),
    })),
  );
  const id = instance.project.id;
  let issue = ensuredParams?.issue;
  const remove_labels = ensuredParams?.remove_labels;
  if (!issue) {
    issue = await ensureIssue(denops, args);
    if (!issue) {
      return;
    }
  }
  const labels = issue.labels;
  if (labels.length === 0) {
    helper.echo(denops, "This issue has not labels.");
    return;
  }
  if (!remove_labels) {
    const nodes: Node[] = [];
    labels.map((label) => {
      nodes.push({
        display: label,
        params: {
          name: args.name,
          params: { ...params, id, issue: issue, remove_labels: label },
        },
      });
    });
    await openUiSelect(args, nodes);
    return;
  }
  await executeRequest(
    denops,
    client.editProjectIssue,
    url,
    token,
    {
      id,
      issue_iid: issue.iid,
      remove_labels: remove_labels,
    },
    "Successfully remove a label.",
  );
}

export async function browseIssue(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const issue = await ensureIssue(denops, args);
  if (!issue) {
    return;
  }
  await openWithBrowser(denops, issue.web_url);
}

export async function assignIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx, params } = args;
  const { url, token, instance } = ctx;
  const ensuredParams = u.ensure(
    params,
    u.isOptionalOf(u.isObjectOf({
      id: u.isOptionalOf(u.isNumber),
      issue_iid: u.isOptionalOf(u.isNumber),
      assignee_ids: u.isOptionalOf(u.isArrayOf(u.isNumber)),
    })),
  );
  const id = instance.project.id;
  let issue_iid = ensuredParams?.issue_iid;
  const assignee_ids = ensuredParams?.assignee_ids;
  if (!issue_iid) {
    const issue = await ensureIssue(denops, args);
    if (!issue) {
      return;
    }
    issue_iid = issue.iid;
  }
  const members = await client.getProjectMembers(url, token, {
    id: instance.project.id,
  });
  if (members.length === 0) {
    helper.echo(denops, "Project has not members.");
    return;
  }
  if (!assignee_ids) {
    const nodes: Node[] = [];
    members.map((member) => {
      nodes.push({
        display: member.name,
        params: {
          name: args.name,
          params: { ...params, id, issue_iid, assignee_ids: [member.id] },
        },
      });
    });
    await openUiSelect(args, nodes);
    return;
  }
  await executeRequest(denops, client.editProjectIssue, url, token, {
    id,
    issue_iid: issue_iid,
    assignee_ids: assignee_ids,
  }, "Successfully assign a issue.");
}

export async function ensureIssue(
  denops: Denops,
  args: ActionArgs,
) {
  if (isIssue(args.node?.params)) {
    return args.node.params;
  }
  const iid = await helper.input(denops, {
    prompt: "Issue iid: ",
  });
  if (!iid) {
    return;
  }
  const { ctx } = args;
  const { url, token, instance } = ctx;
  const issue = await client.getProjectIssue(url, token, {
    id: instance.project.id,
    issue_iid: Number(iid),
  });
  return issue;
}
