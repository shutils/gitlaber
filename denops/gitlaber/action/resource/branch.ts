import { Denops, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import { ActionArgs, isBranch, isIssue } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";

export async function createBranch(args: ActionArgs): Promise<void> {
  const { denops, ctx, node } = args;
  const { instance, url, token } = ctx;
  let text: string | undefined;
  if (isIssue(node?.params)) {
    const issue = node.params;
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
  if (isBranch(args.node?.params)) {
    return args.node.params;
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
