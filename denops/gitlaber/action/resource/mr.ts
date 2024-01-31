import { base64, fn, helper, unknownutil as u } from "../../deps.ts";
import * as client from "../../client/index.ts";
import {
  ActionArgs,
  isBranch,
  isChange,
  isDiscussion,
  isMergeRequest,
  MergeRequest,
  Node,
  ProjectLabel,
} from "../../types.ts";
import * as util from "../../util.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";
import { openUiInput, openUiSelect } from "../ui/main.ts";
import { createBuffer } from "../../buffer/core.ts";
import { setDiffOptions } from "../../buffer/helper.ts";
import { getBufferConfig } from "../../helper.ts";
import { getBuffer, updateBuffer } from "../../helper.ts";
import {
  createDescriptionNodes,
  createMergeRequestChangesNodes,
  createMergeRequestPanelNodes,
  createMergeRequestsNodes,
} from "../../node/main.ts";
import { clearSign, setSign } from "../../sign/main.ts";
import {
  argsHasAssignee,
  argsHasLabel,
  argsHasReviewer,
  getAssigneeFromArgs,
  getLabelFromArgs,
  getReviewerFromArgs,
  selectAssignee,
  selectLabel,
  selectReviewer,
} from "./common.ts";

export async function openMrList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrList");
  const nodes = await createMergeRequestsNodes(args.denops);
  await createBuffer(args.denops, config, nodes);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await util.focusBuffer(args.denops, bufnr);
}

export async function openMrConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrConfig");
  const nodes = await createMergeRequestPanelNodes(args.denops);
  const bufnr = await createBuffer(args.denops, config, nodes);
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function openMrPreview(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberMrPreview");
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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

export async function openMrChangeList(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
    return;
  }
  const config = getBufferConfig("GitlaberMrChangeList");
  const nodes = await createMergeRequestChangesNodes(denops);
  const bufnr = await createBuffer(denops, config, nodes);
  const winnr = await util.getBufferWindowNumber(args.denops, bufnr);
  await updateBuffer(denops, bufnr, undefined, {
    id: ctx.instance.project.id,
    mr: mr,
  });
  const mrDiscussionConfig = getBufferConfig("GitlaberMrDiscussion");
  const discussionNodes: Node[] = [];
  const discussions = await client.getProjectMrDiscussion(
    ctx.url,
    ctx.token,
    {
      id: ctx.instance.project.id,
      mr_iid: mr.iid,
    },
  );
  discussions.map((discussion) => {
    if (discussion.notes[0].system === true) {
      return;
    }
    const lines = discussion.notes[0].body?.split("\n");
    if (!lines) {
      return;
    }
    lines.map((line) => {
      discussionNodes.push({
        display: line,
        params: {
          name: args.name,
          params: { id: ctx.instance.project.id, mr: mr },
        },
      });
    });
    discussionNodes.push({
      display: "",
    });
  });
  await createBuffer(
    denops,
    mrDiscussionConfig,
    discussionNodes,
  );
  const oldFileConfig = getBufferConfig("GitlaberDiffOldFile");
  const newFileConfig = getBufferConfig("GitlaberDiffNewFile");
  await fn.execute(denops, "diffoff!");
  const listWidth = 30;
  const oldFileBufnr = await createBuffer(
    denops,
    oldFileConfig,
    [{ display: "" }],
  );
  setDiffOptions(denops, oldFileBufnr);
  await fn.win_execute(args.denops, winnr, `vertical resize ${listWidth}`);
  const newFileBufnr = await createBuffer(
    denops,
    newFileConfig,
    [{ display: "" }],
  );
  setDiffOptions(denops, newFileBufnr);

  await fn.win_gotoid(args.denops, winnr);
  await denops.cmd("redraw");
}

async function assignMergeRequestMember(
  args: ActionArgs,
  role: "assignee" | "reviewer",
) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
    return;
  }
  const id = instance.project.id;
  let extraAttrs: object;
  if (role === "assignee") {
    let assignee_id: number;
    if (argsHasAssignee(args)) {
      assignee_id = getAssigneeFromArgs(args);
    } else {
      selectAssignee(args);
      return;
    }

    extraAttrs = {
      assignee_id: assignee_id,
    };
  } else {
    let reviewer_id: number;
    if (argsHasReviewer(args)) {
      reviewer_id = getReviewerFromArgs(args);
    } else {
      selectReviewer(args);
      return;
    }

    extraAttrs = {
      reviewer_ids: [reviewer_id],
    };
  }
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id,
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
  if (isBranch(node?.params?.branch)) {
    const branch = node.params.branch;
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

export async function editMergeRequestDescription(args: ActionArgs) {
  const { denops, ctx } = args;
  const bufnr = await fn.bufnr(denops);
  const buffer = await getBuffer(denops, bufnr);
  const bufferParams = u.ensure(
    buffer.params,
    u.isObjectOf({
      id: u.isNumber,
      merge_request_iid: u.isNumber,
    }),
  );
  const { id, merge_request_iid } = bufferParams;
  const lines = await util.flattenBuffer(
    denops,
    await fn.bufname(denops, bufnr),
  );
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    ctx.url,
    ctx.token,
    {
      id,
      merge_request_iid,
      description: lines,
    },
    "Successfully updated a merge request.",
  );
}

export async function browseMergeRequest(args: ActionArgs) {
  const { denops } = args;
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
    return;
  }
  await openWithBrowser(denops, mr.web_url);
}

export async function approveMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
    return;
  }
  let label: ProjectLabel;
  if (argsHasLabel(args)) {
    label = getLabelFromArgs(args);
  } else {
    selectLabel(args);
    return;
  }
  const id = instance.project.id;
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id,
      merge_request_iid: mr.iid,
      add_labels: label.name,
    },
    "Successfully add a label.",
  );
}

export async function unlabelMergeRequest(args: ActionArgs) {
  const { denops, ctx, params } = args;
  const { instance, url, token } = ctx;
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
    return;
  }
  let label: string;
  if (u.isString(params?.label)) {
    label = params.label;
  } else {
    selectLabelFromMergeRequest(args, mr);
    return;
  }
  const id = instance.project.id;
  const remove_labels = label;
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id,
      merge_request_iid: mr.iid,
      remove_labels,
    },
    "Successfully remove a label.",
  );
}

export async function mergeMergeRequest(args: ActionArgs) {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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
  let mr: MergeRequest;
  if (argsHasMergeRequest(args)) {
    mr = getMergeRequestFromArgs(args);
  } else {
    selectMergeRequest(args);
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

export async function openMrChangeDiff(args: ActionArgs) {
  const { denops, node, ctx } = args;
  if (!node) {
    return;
  }
  const bufnr = await fn.bufnr(denops);
  const buffer = await getBuffer(denops, bufnr);
  const bufferParams = u.ensure(
    buffer.params,
    u.isObjectOf({
      id: u.isNumber,
      mr: isMergeRequest,
    }),
  );
  const change = u.ensure(
    node.params,
    isChange,
  );
  const mr = bufferParams.mr;
  if (!mr.diff_refs) {
    return;
  }
  const discussions = await client.getProjectMrDiscussion(
    ctx.url,
    ctx.token,
    {
      id: ctx.instance.project.id,
      mr_iid: mr.iid,
    },
  );
  const changeFileDiscussion = discussions.filter((discussion) => {
    const position = discussion.notes[0].position;
    if (!position) {
      return false;
    }
    return (
      position.new_path === change.new_path ||
      position.old_path === change.old_path
    );
  });
  const newFileDiscussion = changeFileDiscussion.filter((discussion) => {
    const position = discussion.notes[0].position;
    if (!position) {
      return false;
    }
    return position.new_path === change.new_path;
  });
  const oldFileDiscussion = changeFileDiscussion.filter((discussion) => {
    const position = discussion.notes[0].position;
    if (!position) {
      return false;
    }
    return position.old_path === change.old_path;
  });
  const decoder = new TextDecoder();
  const oldFileNodes: Node[] = [];
  if (!change.new_file) {
    const oldFile = await client.getProjectFile(
      args.ctx.url,
      args.ctx.token,
      {
        id: args.ctx.instance.project.id,
        file_path: change.old_path,
        ref: mr.diff_refs.start_sha,
      },
    );
    const decodedOldFile = decoder.decode(base64.decodeBase64(oldFile.content));
    decodedOldFile.split("\n").map((line) => {
      oldFileNodes.push({
        display: line,
      });
    });
    // There is a blank line at the end of oldFileNodes, so delete it.
    oldFileNodes.pop();
    oldFileDiscussion.map((discussion) => {
      const position = discussion.notes[0].position;
      if (!position) {
        return;
      }
      if (!position.old_line) {
        return;
      }
      oldFileNodes[position.old_line - 1].params = discussion;
    });
  }
  const newFileNodes: Node[] = [];
  if (!change.deleted_file) {
    const newFile = await client.getProjectFile(
      args.ctx.url,
      args.ctx.token,
      {
        id: args.ctx.instance.project.id,
        file_path: change.new_path,
        ref: mr.diff_refs.head_sha,
      },
    );
    const decodedNewFile = decoder.decode(base64.decodeBase64(newFile.content));
    const lines = decodedNewFile.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      newFileNodes.push({
        display: line,
      });
    }
    // There is a blank line at the end of newFileNodes, so delete it.
    newFileNodes.pop();
    newFileDiscussion.map((discussion) => {
      const position = discussion.notes[0].position;
      if (!position) {
        return;
      }
      if (!position.new_line) {
        return;
      }
      newFileNodes[position.new_line - 1].params = discussion;
    });
  }
  const oldFileConfig = getBufferConfig("GitlaberDiffOldFile");
  if (oldFileConfig.options) {
    oldFileConfig.options.filetype = util.predicateFileType(change.old_path) ??
      "";
  }
  const newFileConfig = getBufferConfig("GitlaberDiffNewFile");
  if (newFileConfig.options) {
    newFileConfig.options.filetype = util.predicateFileType(change.new_path) ??
      "";
  }
  const oldFileBufnr = await createBuffer(
    args.denops,
    oldFileConfig,
    oldFileNodes,
  );
  await fn.execute(denops, "diffoff!");
  await clearSign(denops, oldFileBufnr, "GitlaberDiscussion");
  await updateBuffer(denops, oldFileBufnr, undefined, {
    id: ctx.instance.project.id,
    mr,
    change,
  });
  for (let i = 0; i < oldFileDiscussion.length; i++) {
    const discussion = oldFileDiscussion[i];
    const position = discussion.notes[0].position;
    if (!position) {
      continue;
    }
    if (!position.old_line) {
      continue;
    }
    await setSign(
      denops,
      i + 1,
      position.old_line,
      "GitlaberDiscussion",
      oldFileBufnr,
      "GitlaberDiscussion",
    );
  }
  setDiffOptions(denops, oldFileBufnr);
  const newFileBufnr = await createBuffer(
    args.denops,
    newFileConfig,
    newFileNodes,
  );
  await clearSign(denops, newFileBufnr, "GitlaberDiscussion");
  await updateBuffer(denops, newFileBufnr, undefined, {
    id: ctx.instance.project.id,
    mr,
    change,
  });
  for (let i = 0; i < newFileDiscussion.length; i++) {
    const discussion = newFileDiscussion[i];
    const position = discussion.notes[0].position;
    if (!position) {
      continue;
    }
    if (!position.new_line) {
      continue;
    }
    await setSign(
      denops,
      i + 1,
      position.new_line,
      "GitlaberDiscussion",
      newFileBufnr,
      "GitlaberDiscussion",
    );
  }
  setDiffOptions(denops, newFileBufnr);
  await denops.cmd("redraw");
}

export async function createMrDiscussion(args: ActionArgs) {
  function hasDiff(hlgroup: string) {
    return ["DiffAdd", "DiffChange", "DiffText"].some((matchStr) =>
      hlgroup === matchStr
    );
  }
  const { denops, ctx, params } = args;
  const { url, token } = ctx;
  const ensuredParams = u.ensure(
    params,
    u.isOptionalOf(u.isObjectOf({
      id: u.isOptionalOf(u.isNumber),
      mr: u.isOptionalOf(isMergeRequest),
      change: u.isOptionalOf(isChange),
      body: u.isOptionalOf(u.isString),
      line_pos: u.isOptionalOf(u.isObjectOf({
        old_line: u.isOptionalOf(u.isNumber),
        new_line: u.isOptionalOf(u.isNumber),
      })),
    })),
  );
  let id = ensuredParams?.id;
  let mr = ensuredParams?.mr;
  let change = ensuredParams?.change;
  let line_pos = ensuredParams?.line_pos;
  const body = ensuredParams?.body;
  const bufnr = await fn.bufnr(denops);
  const buffer = await getBuffer(denops, bufnr);
  const isOldFile = buffer.kind === "GitlaberDiffOldFile";
  if (!id || !mr || !change || !line_pos) {
    const bufferParams = u.ensure(
      buffer.params,
      u.isObjectOf({
        id: u.isNumber,
        mr: isMergeRequest,
        change: isChange,
      }),
    );
    id = bufferParams.id;
    mr = bufferParams.mr;
    change = bufferParams.change;
    const linenr = await fn.line(denops, ".");
    const colnr = await fn.col(denops, ".");
    const synID = await fn.diff_hlID(denops, linenr, colnr);
    const hlgroup = await fn.synIDattr(
      denops,
      synID,
      "name",
    );
    if (isOldFile && hasDiff(hlgroup)) {
      line_pos = {
        old_line: linenr,
      };
    } else if (!isOldFile && hasDiff(hlgroup)) {
      line_pos = {
        new_line: linenr,
      };
    } else {
      helper.echoerr(denops, "This feature is not yet supported.");
      return;
    }
  }
  if (!mr.diff_refs) {
    return;
  }
  if (!body) {
    await openUiInput(args, "body", {
      id,
      mr,
      change,
      line_pos,
    });
    return;
  }
  await executeRequest(
    denops,
    client.createProjectMrDiscussion,
    url,
    token,
    {
      id,
      merge_request_iid: mr.iid,
      body,
      position: {
        base_sha: mr.diff_refs.base_sha,
        head_sha: mr.diff_refs.head_sha,
        start_sha: mr.diff_refs.start_sha,
        new_path: change.new_path,
        old_path: change.old_path,
        position_type: "text",
        ...line_pos,
      },
    },
    "Successfully create a discussion.",
  );
}

export async function inspectMrDiscussion(args: ActionArgs) {
  const { denops, node } = args;
  if (!node) {
    return;
  }
  const discussion = u.ensure(
    node.params,
    isDiscussion,
  );
  const nodes: Node[] = [];
  discussion.notes.map((note) => {
    if (note.system === true) {
      return;
    }
    nodes.push({
      display: `${note.author.name}:`,
    });
    nodes.push({
      display: "------------------",
    });
    const lines = note.body?.split("\n");
    if (!lines) {
      return;
    }
    lines.map((line) => {
      nodes.push({
        display: line,
      });
    });
    nodes.push({
      display: "",
    });
  });
  await createBuffer(
    denops,
    getBufferConfig("GitlaberMrDiscussionInspect"),
    nodes,
  );
}

function argsHasMergeRequest(args: ActionArgs): boolean {
  if (isMergeRequest(args.params?.mr)) {
    return true;
  } else if (isMergeRequest(args.node?.params?.mr)) {
    return true;
  }
  return false;
}

function getMergeRequestFromArgs(args: ActionArgs): MergeRequest {
  if (isMergeRequest(args.params?.mr)) {
    return args.params.mr;
  } else if (isMergeRequest(args.node?.params?.mr)) {
    return args.node.params.mr;
  }
  throw new Error("Merge request not found.");
}

async function selectMergeRequest(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { instance, url, token } = ctx;
  const id = instance.project.id;
  const mrs = await client.getProjectMergeRequests(url, token, { id });
  if (mrs.length === 0) {
    helper.echo(denops, "Project has not merge requests.");
    return;
  }
  const nodes: Node[] = [];
  mrs.map((mr) => {
    nodes.push({
      display: `#${mr.iid} ${mr.title}`,
      params: {
        action: {
          name: args.name,
          params: { id, mr },
        },
      },
    });
  });
  await openUiSelect(args, nodes);
}

async function selectLabelFromMergeRequest(
  args: ActionArgs,
  mr: MergeRequest,
): Promise<void> {
  const { denops } = args;
  const labels = mr.labels;
  if (labels.length === 0) {
    helper.echo(denops, "This merge request has not labels.");
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
