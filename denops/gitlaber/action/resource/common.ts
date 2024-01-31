import { fn, helper, unknownutil as u } from "../../deps.ts";

import { ActionArgs, isBranch, isProjectLabel, Node } from "../../types.ts";
import { getBuffer, updateBuffer } from "../../helper.ts";
import { reRenderBuffer } from "../../buffer/core.ts";
import * as client from "../../client/index.ts";
import { openUiSelect } from "../ui/main.ts";

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

export async function selectAssignee(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const members = await client.getProjectMembers(url, token, {
    id: instance.project.id,
  });
  if (members.length === 0) {
    helper.echo(denops, "Project has not members.");
    return;
  }
  const nodes: Node[] = [];
  members.map((member) => {
    nodes.push({
      display: member.name,
      params: {
        name: args.name,
        params: { ...args.params, assignee_id: member.id },
      },
    });
  });
  await openUiSelect(args, nodes);
}

export function argsHasAssignee(
  args: ActionArgs,
) {
  return u.isNumber(args.params?.assignee_id);
}

export function getAssigneeFromArgs(
  args: ActionArgs,
) {
  return u.ensure(args.params?.assignee_id, u.isNumber);
}

export function argsHasReviewer(
  args: ActionArgs,
) {
  return u.isNumber(args.params?.reviewer_id);
}

export function getReviewerFromArgs(
  args: ActionArgs,
) {
  return u.ensure(args.params?.reviewer_id, u.isNumber);
}

export async function selectReviewer(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const members = await client.getProjectMembers(url, token, {
    id: instance.project.id,
  });
  if (members.length === 0) {
    helper.echo(denops, "Project has not members.");
    return;
  }
  const nodes: Node[] = [];
  members.map((member) => {
    nodes.push({
      display: member.name,
      params: {
        name: args.name,
        params: { ...args.params, reviewer_id: member.id },
      },
    });
  });
  await openUiSelect(args, nodes);
}

export function argsHasBranch(args: ActionArgs) {
  return isBranch(args.params?.branch);
}

export function getBranchFromArgs(args: ActionArgs) {
  return u.ensure(args.params?.branch, isBranch);
}

export async function selectBranch(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const branches = await client.getProjectBranches(url, token, {
    id: instance.project.id,
  });
  if (branches.length === 0) {
    helper.echo(denops, "Project has not branches.");
    return;
  }
  const nodes: Node[] = [];
  branches.map((branch) => {
    nodes.push({
      display: branch.name,
      params: {
        name: args.name,
        params: { ...args.params, branch: branch },
      },
    });
  });
  await openUiSelect(args, nodes);
}

export async function selectLabel(args: ActionArgs): Promise<void> {
  const { url, token, instance } = args.ctx;
  const id = instance.project.id;
  const labels = await client.getProjectLabels(url, token, { id });
  if (labels.length === 0) {
    helper.echo(args.denops, "Project has not labels.");
    return;
  }
  const nodes: Node[] = [];
  labels.map((label) => {
    nodes.push({
      display: label.name,
      params: {
        name: args.name,
        params: { ...args.params, label: label },
      },
    });
  });
  await openUiSelect(args, nodes);
}

export function argsHasLabel(args: ActionArgs) {
  return isProjectLabel(args.params?.label);
}

export function getLabelFromArgs(args: ActionArgs) {
  return u.ensure(args.params?.label, isProjectLabel);
}
