import { Denops, fn, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import { ActionArgs, isBranch, isIssue } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";
import { getBufferConfig } from "../../helper.ts";
import { createBuffer } from "../../buffer/core.ts";
import {
  createBranchesNodes,
  createBranchPanelNodes,
} from "../../node/main.ts";
import * as util from "../../util.ts";

export async function openBranchList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberBranchList");
  const nodes = await createBranchesNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await util.focusBuffer(args.denops, bufnr);
}

export async function openBranchConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberBranchConfig");
  const nodes = await createBranchPanelNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function createBranch(args: ActionArgs): Promise<void> {
  const { denops, ctx, node } = args;
  const { instance, url, token } = ctx;
  let text: string | undefined;
  if (isIssue(node?.params?.issue)) {
    const issue = node.params.issue;
    text = `${issue.iid}-${issue.title}`;
  }
  const defaultBranch = instance.project.default_branch;
  const title = await helper.input(denops, {
    prompt: "New branch name: ",
    text: text,
  });
  if (!title) {
    return;
  }
  const ref = await helper.input(denops, {
    prompt: "Ref branch name: ",
    text: defaultBranch,
  });
  if (!ref) {
    return;
  }
  await executeRequest(denops, client.createProjectBranch, url, token, {
    id: instance.project.id,
    branch: title,
    ref: ref,
  }, "Successfully create a new branch.");
}

export async function browseBranch(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const branch = await ensureBranch(denops, args);
  if (!branch) {
    return;
  }
  await openWithBrowser(denops, branch.web_url);
}

async function ensureBranch(
  denops: Denops,
  args: ActionArgs,
) {
  if (isBranch(args.node?.params?.branch)) {
    return args.node.params.branch;
  }
  const branchName = await helper.input(denops, {
    prompt: "Branch name: ",
  });
  if (!branchName) {
    return;
  }
  const { ctx } = args;
  const { url, token, instance } = ctx;
  const branch = await client.getProjectBranch(url, token, {
    id: instance.project.id,
    branch: branchName,
  });
  return branch;
}
