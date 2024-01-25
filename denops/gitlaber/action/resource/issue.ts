import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import { ActionArgs, isIssue } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";

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

export async function editIssue(args: ActionArgs): Promise<void> {
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
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const issue = await ensureIssue(denops, args);
  if (!issue) {
    return;
  }
  const labels = await client.getProjectLabels(
    url,
    token,
    {
      id: instance.project.id,
    },
  );
  if (labels.length === 0) {
    helper.echo(denops, "Project has not labels.");
    return;
  }
  const description = "Select the label number you want to add.";
  const textlist: string[] = [description];
  for (let i = 0; i < labels.length; i++) {
    textlist.unshift(`${i + 1}. ${labels[i].name}`);
  }
  const labelIndex = await fn.inputlist(denops, textlist.reverse());
  if (!labelIndex) {
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
      add_labels: labels[labelIndex - 1].name,
    },
    "Successfully add a label.",
  );
}

export async function unlabelIssue(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const issue = await ensureIssue(denops, args);
  if (!issue) {
    return;
  }
  const labels = issue.labels;
  if (labels.length === 0) {
    helper.echo(denops, "This issue has not labels.");
    return;
  }
  const description = "Select the label number you want to remove.";
  const textlist: string[] = [description];
  for (let i = 0; i < labels.length; i++) {
    textlist.unshift(`${i + 1}. ${labels[i]}`);
  }
  const labelIndex = await fn.inputlist(denops, textlist.reverse());
  if (!labelIndex) {
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
      remove_labels: labels[labelIndex - 1],
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
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const issue = await ensureIssue(denops, args);
  if (!issue) {
    return;
  }
  const members = await client.getProjectMembers(url, token, {
    id: instance.project.id,
  });
  if (members.length === 0) {
    helper.echo(denops, "Project has not members.");
    return;
  }
  const description = "Select the member number you want to assign.";
  const contents: string[] = [];
  for (let i = 0; i < members.length; i++) {
    contents.unshift(`${i + 1}. ${members[i].name}`);
  }
  const labelIndex = await util.select(denops, contents, description);
  if (!labelIndex) {
    return;
  }
  await executeRequest(denops, client.editProjectIssue, url, token, {
    id: instance.project.id,
    issue_iid: issue.iid,
    assignee_ids: [members[labelIndex - 1].id],
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
