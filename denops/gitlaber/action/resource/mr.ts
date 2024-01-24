import { Denops, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import { ActionArgs, isBranch, isMergeRequest } from "../../types.ts";
import * as util from "../../util.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";

async function assignMergeRequestMember(
  args: ActionArgs,
  role: "assignee" | "reviewer",
) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
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
  let extraAttrs: object;
  if (role === "assignee") {
    extraAttrs = {
      assignee_id: members[labelIndex - 1].id,
    };
  } else {
    extraAttrs = {
      reviewer_ids: [members[labelIndex - 1].id],
    };
  }
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
      ...extraAttrs,
    },
    "Successfully assine a member.",
  );
}

export async function createMergeRequest(args: ActionArgs) {
  const { denops, ctx, node } = args;
  const { instance, url, token } = ctx;
  let currentBranch: string | undefined;
  let defaultTitle: string | undefined;
  if (isBranch(node?.params)) {
    const branch = node.params;
    currentBranch = branch.name;
    const commitId = branch.commit.short_id;
    const commit = await client.getProjectCommit(
      url,
      token,
      {
        id: instance.project.id,
        sha: commitId,
      },
    );
    defaultTitle = commit.title;
  }
  const defaultBranch = instance.project.default_branch;
  const soruce = await helper.input(denops, {
    prompt: "Source branch: ",
    text: currentBranch,
  });
  if (!soruce) {
    return;
  }
  const terget = await helper.input(denops, {
    prompt: "Terget branch: ",
    text: defaultBranch,
  });
  if (!terget) {
    return;
  }
  const title = await helper.input(denops, {
    prompt: "Merge request title: ",
    text: defaultTitle,
  });
  if (!title) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt:
      `Are you sure you want to create a merge request? (${soruce} into ${terget}) y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  executeRequest(
    denops,
    client.createProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      title: title,
      source_branch: soruce,
      target_branch: terget,
    },
    "Successfully created a new merge request.",
  );
}

export async function browseMergeRequest(args: ActionArgs) {
  const { denops } = args;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  await openWithBrowser(denops, mr.web_url);
}

export async function approveMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to approve a merge request? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(
    denops,
    client.approveProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
    },
    "Successfully approve a merge request.",
  );
}

export async function assignAssigneeMergeRequest(args: ActionArgs) {
  await assignMergeRequestMember(args, "assignee");
}

export async function assignReviewerMergeRequest(args: ActionArgs) {
  await assignMergeRequestMember(args, "reviewer");
}

export async function closeMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to close a merge request? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
      state_event: "close",
    },
    "Successfully close a merge request.",
  );
}

export async function reopenMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to reopen a merge request? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
      state_event: "reopen",
    },
    "Successfully reopen a merge request.",
  );
}

export async function deleteMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to delete a merge request? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(
    denops,
    client.deleteProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
    },
    "Successfully delete a merge request.",
  );
}

export async function labelMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const labels = await client.getProjectLabels(url, token, {
    id: instance.project.id,
  });
  if (labels.length === 0) {
    helper.echo(denops, "Project has not labels.");
    return;
  }
  const description = "Select the label number you want to add.";
  const contents: string[] = [];
  for (let i = 0; i < labels.length; i++) {
    contents.unshift(`${i + 1}. ${labels[i].name}`);
  }
  const labelIndex = await util.select(denops, contents, description);
  if (!labelIndex) {
    return;
  }
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
      add_labels: labels[labelIndex - 1].name,
    },
    "Successfully add a label.",
  );
}

export async function unlabelMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const labels = await client.getProjectLabels(url, token, {
    id: instance.project.id,
  });
  if (labels.length === 0) {
    helper.echo(denops, "Project has not labels.");
    return;
  }
  const description = "Select the label number you want to remove.";
  const contents: string[] = [];
  for (let i = 0; i < labels.length; i++) {
    contents.unshift(`${i + 1}. ${labels[i].name}`);
  }
  const labelIndex = await util.select(denops, contents, description);
  if (!labelIndex) {
    return;
  }
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
      remove_labels: labels[labelIndex - 1].name,
    },
    "Successfully remove a label.",
  );
}

export async function mergeMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to merge a merge request? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  const remove_source_branch = await helper.input(denops, {
    prompt: `Do you want to remove the source branch? y/N: `,
  });
  const squash = await helper.input(denops, {
    prompt: `Do you want to squash? y/N: `,
  });
  let squash_commit_message: string | undefined;
  if (squash === "y") {
    const sourceBranch = mr.source_branch;

    const branch = await client.getProjectBranch(
      url,
      token,
      {
        id: instance.project.id,
        branch: sourceBranch,
      },
    );
    const input = await helper.input(denops, {
      prompt: `Squash commit message: `,
      text: branch.commit.title,
    });
    squash_commit_message = input ?? undefined;
  }
  await executeRequest(
    denops,
    client.mergeProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
      should_remove_source_branch: remove_source_branch === "y",
      squash: squash === "y",
      squash_commit_message: squash_commit_message,
    },
    "Successfully merge a merge request.",
  );
}

export async function unapproveMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const mr = await ensureMergeRequest(denops, args);
  if (!mr) {
    return;
  }
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to unapprove a merge request? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(
    denops,
    client.unapproveProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
    },
    "Successfully unapprove a merge request.",
  );
}

async function ensureMergeRequest(
  denops: Denops,
  args: ActionArgs,
) {
  if (isMergeRequest(args.node?.params)) {
    return args.node.params;
  }
  const mrIid = await helper.input(denops, {
    prompt: "Merge request IID: ",
  });
  if (!mrIid) {
    return;
  }
  const { ctx } = args;
  const { url, token, instance } = ctx;
  const mr = await client.getProjectMergeRequest(url, token, {
    id: instance.project.id,
    merge_request_iid: Number(mrIid),
  });
  return mr;
}
