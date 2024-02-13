import { base64, Denops, unknownutil as u } from "../deps.ts";
import * as client from "../client/index.ts";

import {
  Context,
  Discussion,
  isBranchListSeed,
  isIssueListSeed,
  isIssuePreviewSeed,
  isJobListForPipelineSeed,
  isJobListSeed,
  isJobLogSeed,
  isMrChangeListSeed,
  isMrDiscussionInspectSeed,
  isMrDiscussionSeed,
  isMrFileWithDiscussionSeed,
  isMrListSeed,
  isMrPreviewSeed,
  isPaginationAttributes,
  isWikiListSeed,
  isWikiPreviewSeed,
  Lint,
  Node,
  NodeParam,
  ResourceKind,
} from "../types.ts";
import { getBuffer, getContext, getCurrentNode } from "../helper.ts";
// import { getKv } from "../../kv.ts";

async function makeNode(
  denops: Denops,
  callback: (
    args: Context & { node?: Node },
  ) => Promise<Node[]>,
) {
  const ctx = await getContext(denops);

  let node: Node | undefined;
  try {
    node = await getCurrentNode(denops);
  } catch {
    node = undefined;
  }
  return callback({
    ...ctx,
    node: node,
  });
}

export const createMainPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (args) => {
    const { instance } = args;
    const project = instance.project;
    const texts = [
      "Project Status",
      "",
      `cwd: ${instance.cwd}`,
      `id: ${project.id}`,
      `name: ${project.name}`,
      `description: ${project.description}`,
      `created_at: ${project.created_at}`,
      `updated_at: ${project.updated_at}`,
      `open_issues_count: ${project.open_issues_count}`,
    ];
    const nodes: Array<Node> = [];
    texts.map((text) => {
      nodes.push({
        display: text,
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createIssuePanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Issue Config",
    });
    return await Promise.resolve(nodes);
  });
};

export const createIssuesNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (args) => {
    let pageAttrs: Record<string, unknown> | undefined;
    try {
      const buffer = await getBuffer(args.denops);
      pageAttrs = u.ensure(
        buffer.params,
        u.isOptionalOf(isPaginationAttributes),
      );
    } catch {
      pageAttrs = {};
    }
    const { url, token, id } = u.ensure(seed, isIssueListSeed);
    const projectIssues = await client.getProjectIssues(url, token, {
      id,
      ...pageAttrs,
    });
    return Promise.resolve(createNodes(
      projectIssues,
      "issue",
      ["iid", "title", "labels", "state", "assignees"],
    ));
  });
};

export const createBranchPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Branch Config",
    });
    return await Promise.resolve(nodes);
  });
};

export const createBranchesNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (args) => {
    let pageAttrs: Record<string, unknown> | undefined;
    try {
      const buffer = await getBuffer(args.denops);
      pageAttrs = u.ensure(
        buffer.params,
        u.isOptionalOf(isPaginationAttributes),
      );
    } catch {
      pageAttrs = {};
    }
    const { url, token, id } = u.ensure(seed, isBranchListSeed);
    const projectBranches = await client.getProjectBranches(url, token, {
      id,
      ...pageAttrs,
    });
    return await Promise.resolve(
      createNodes(projectBranches, "branch", ["name", "merged"]),
    );
  });
};

export const createWikiNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { url, token, id } = u.ensure(seed, isWikiListSeed);
    const projectWikis = await client.getProjectWikis(url, token, {
      id,
    });
    return await Promise.resolve(
      createNodes(projectWikis, "wiki", ["title", "format"]),
    );
  });
};

export async function createIssueDescriptionNodes(
  _denops: Denops,
  seed?: Record<string, unknown>,
) {
  const { id, issue_iid, url, token } = u.ensure(seed, isIssuePreviewSeed);
  const issue = await client.getProjectIssue(url, token, {
    id,
    issue_iid,
  });
  if (issue.description === null) {
    return await Promise.resolve([]);
  }
  const nodes: Node[] = [];
  const lines = issue.description.split("\n");
  lines.map((line) => {
    nodes.push({
      display: line,
    });
  });
  return await Promise.resolve(nodes);
}

export async function createMergeRequestDescriptionNodes(
  _denops: Denops,
  seed?: Record<string, unknown>,
) {
  const { id, merge_request_iid, url, token } = u.ensure(seed, isMrPreviewSeed);
  const mergeRequest = await client.getProjectMergeRequest(url, token, {
    id,
    merge_request_iid,
  });
  if (mergeRequest.description === null) {
    return await Promise.resolve([]);
  }
  const nodes: Node[] = [];
  const lines = mergeRequest.description.split("\n");
  lines.map((line) => {
    nodes.push({
      display: line,
    });
  });
  return await Promise.resolve(nodes);
}

export const createWikiPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Wiki Config",
    });
    return await Promise.resolve(nodes);
  });
};

export const createWikiContentNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { url, token, id, slug } = u.ensure(seed, isWikiPreviewSeed);
    const projectWiki = await client.getProjectWiki(url, token, {
      id,
      slug,
    });
    const nodes: Node[] = [];
    const lines = projectWiki.content.split("\n");
    lines.map((line) => {
      nodes.push({
        display: line,
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createContentNodes = async (
  seed: {
    content: string;
    [key: string]: unknown;
  },
) => {
  const nodes: Node[] = [];
  const lines = seed.content.split("\n");
  lines.map((line) => {
    nodes.push({
      display: line,
    });
  });
  return await Promise.resolve(nodes);
};

export const createMergedYamlNodes = async (
  lint: Lint,
) => {
  if (lint.merged_yaml === null) {
    return await Promise.resolve([]);
  }
  const nodes: Node[] = [];
  const lines = lint.merged_yaml.split("\n");
  lines.map((line) => {
    nodes.push({
      display: line,
    });
  });
  return await Promise.resolve(nodes);
};

export const createMergeRequestPanelNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (_args) => {
    const nodes: Array<Node> = [];
    nodes.push({
      display: "Merge Request Config",
    });
    return await Promise.resolve(nodes);
  });
};

export const createMergeRequestsNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { url, token, id, path_with_namespace } = u.ensure(
      seed,
      isMrListSeed,
    );
    const projectMergeRequests = await client.getProjectMergeRequestsGraphQL(
      url,
      token,
      path_with_namespace,
      id,
    );
    return await Promise.resolve(createNodes(
      projectMergeRequests,
      "mr",
      ["iid", "title", "state", "assignees", "reviewers", "labels", "approved"],
    ));
  });
};

export const createMergeRequestChangesNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const createDisplay = (change: {
      new_file: boolean;
      old_path: string;
      new_path: string;
      deleted_file: boolean;
    }) => {
      let display: string;
      if (change.new_file) {
        display = `Created ${change.new_path}`;
      } else if (change.deleted_file) {
        display = `Deleted ${change.old_path}`;
      } else if (change.new_path !== change.old_path) {
        display = `${change.old_path} -> ${change.new_path}`;
      } else {
        display = change.new_path;
      }
      return display;
    };

    const { id, merge_request_iid, url, token } = u.ensure(
      seed,
      isMrChangeListSeed,
    );
    const projectMergeRequestChanges = await client
      .getProjectMergeRequestChanges(
        url,
        token,
        {
          id,
          merge_request_iid,
        },
      );
    const nodes: Node[] = [];
    const changes = projectMergeRequestChanges.changes;
    changes.map((change) => {
      nodes.push({
        display: createDisplay(change),
        params: { change },
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createMergeRequestDiscussionsNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { id, merge_request_iid, url, token } = u.ensure(
      seed,
      isMrDiscussionSeed,
    );
    const projectMergeRequestDiscussions = await client.getProjectMrDiscussions(
      url,
      token,
      { id, merge_request_iid },
    );
    const nodes: Node[] = [];
    projectMergeRequestDiscussions.map((discussion) => {
      if (discussion.notes[0].system === true) {
        return;
      }
      nodes.push({
        display: "--------------",
      });
      nodes.push({
        display: `${discussion.notes[0].resolved ? "Resolved" : "Unresolved"}`,
      });
      const filepath = discussion.notes[0].position?.new_path ??
        discussion.notes[0].position?.old_path;
      const position = discussion.notes[0].position?.new_line ??
        discussion.notes[0].position?.old_line;
      if (filepath && position) {
        nodes.push({
          display: `${filepath} ${position}`,
        });
      }
      discussion.notes.map((note) => {
        if (note.system === true) {
          return;
        }
        const lines = note.body?.split("\n");
        if (!lines) {
          return;
        }
        nodes.push({
          display: `@${note.author.name} ${note.created_at}`,
        });
        nodes.push({
          display: "--------------",
        });
        lines.map((line) => {
          nodes.push({
            display: line,
          });
        });
        nodes.push({
          display: "",
        });
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createMrFileWithDiscussionNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    if (!isMrFileWithDiscussionSeed(seed)) {
      return await Promise.resolve([]);
    }
    const { url, token, id, file_path, ref, merge_request_iid, kind } = u
      .ensure(seed, isMrFileWithDiscussionSeed);
    const discussions = await client.getProjectMrDiscussions(url, token, {
      id,
      merge_request_iid,
    });
    const positionDiscussions = discussions.filter((discussion) => {
      return discussion.notes[0].position !== null;
    });
    const fileDiscussions: Discussion[] = [];
    if (kind === "old") {
      positionDiscussions.map((discussion) => {
        if (discussion.notes[0].position?.old_path === file_path) {
          fileDiscussions.push(discussion);
        }
      });
    } else {
      positionDiscussions.map((discussion) => {
        if (discussion.notes[0].position?.new_path === file_path) {
          fileDiscussions.push(discussion);
        }
      });
    }
    let file;
    try {
      file = await client.getProjectFile(url, token, {
        id,
        file_path,
        ref,
      });
    } catch {
      return await Promise.resolve([]);
    }
    const nodes: Node[] = [];
    const decodedFile = new TextDecoder().decode(
      base64.decodeBase64(file.content),
    );
    decodedFile.split("\n").map((line) => {
      nodes.push({
        display: line,
      });
    });
    // There is a blank line at the end of nodes, so delete it.
    nodes.pop();

    // Add discussions to nodes.
    fileDiscussions.map((discussion) => {
      const position = discussion.notes[0].position;
      if (!position) {
        return;
      }
      const line = position.new_line ?? position.old_line;
      if (line === null) {
        return;
      }
      if (nodes[line - 1] === undefined) {
        return;
      }
      if (nodes[line - 1].params === undefined) {
        nodes[line - 1] = {
          ...nodes[line - 1],
          params: {
            discussion: discussion,
            sign: {
              name: "GitlaberDiscussion",
              group: "GitlaberDiscussion",
            },
          },
        };
      } else {
        nodes[line - 1].params = {
          ...nodes[line - 1].params,
          discussion: discussion,
          sign: {
            name: "GitlaberDiscussion",
            group: "GitlaberDiscussion",
          },
        };
      }
    });
    return await Promise.resolve(nodes);
  });
};

export const createMrDiscussionInspectNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { url, token, id, merge_request_iid, discussion_id } = u.ensure(
      seed,
      isMrDiscussionInspectSeed,
    );
    const discussion = await client.getProjectMrDiscussion(url, token, {
      id,
      merge_request_iid,
      discussion_id,
    });
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
    return await Promise.resolve(nodes);
  });
};

export const createPipelinesNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { url, token, id } = u.ensure(seed, isIssueListSeed);
    const projectPipelines = await client.getProjectPipelines(url, token, {
      id,
    });
    return await Promise.resolve(
      createNodes(projectPipelines, "pipeline", [
        "id",
        "iid",
        "status",
        "source",
        "ref",
        "created_at",
      ]),
    );
  });
};

export const createJobsNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { url, token, id } = u.ensure(seed, isJobListSeed);
    const projectJobs = await client.getProjectJobs(url, token, {
      id,
    });
    return await Promise.resolve(
      createNodes(projectJobs, "job", [
        "id",
        "name",
        "status",
        "stage",
        "ref",
        "created_at",
      ]),
    );
  });
};

export const createJobsForPipelineNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  return await makeNode(denops, async (_args) => {
    const { url, token, id, pipeline_id } = u.ensure(
      seed,
      isJobListForPipelineSeed,
    );
    const pipelineJobs = await client.getPipelineJobs(url, token, {
      id,
      pipeline_id,
    });
    return await Promise.resolve(
      createNodes(pipelineJobs, "job", [
        "id",
        "name",
        "status",
        "stage",
        "ref",
        "created_at",
      ]),
    );
  });
};

export const createJobLogNodes = async (
  denops: Denops,
  seed?: Record<string, unknown>,
) => {
  const removeAnsiEscape = (str: string) => {
    return str.replace(/\x1b\[[0-9;]*m/g, "");
  };
  const removeSectionEscape = (str: string) => {
    return str.replace(/section.*\x0D/g, "");
  };
  const removeAnsiEscapeK = (str: string) => {
    return str.replace(/\x1b\[[0-9;]*K/g, "");
  };
  const getRawString = (str: string) => {
    return removeAnsiEscapeK(removeAnsiEscape(removeSectionEscape(str)));
  };
  return await makeNode(denops, async (_args) => {
    const { url, token, id, job_id } = u.ensure(seed, isJobLogSeed);
    const jobLog = await client.getProjectJobLog(url, token, {
      id,
      job_id,
    });
    const nodes: Node[] = [];
    const lines = jobLog.split("\n");
    lines.map((line) => {
      nodes.push({
        display: getRawString(line),
      });
    });
    return await Promise.resolve(nodes);
  });
};

export const createEmptyNodes = async (
  _denops: Denops,
) => {
  return await Promise.resolve([]);
};

export const createNodes = (
  resources: Record<string, unknown>[],
  resourceKind: ResourceKind,
  columns: string[],
): Node[] => {
  const nodes: Array<Node> = [];

  const maxColumnWidths: Record<string, number> = {};
  columns.forEach((column) => {
    maxColumnWidths[column] = Math.max(column.length, 1);
    resources.forEach((resource) => {
      if (!resource) {
        return;
      }
      const prop = resource[column as keyof typeof resource];
      if (u.isObjectOf({ ...u.isUnknown })(prop)) {
        throw new Error(
          `A column has been specified that cannot be displayed: ${column}`,
        );
      }
      const value = (prop as string | Array<string> | Array<number>)
        .toString();
      const width = calculateStringWidth(value);
      if (maxColumnWidths[column] < width) {
        maxColumnWidths[column] = width;
      }
    });
  });

  let header = "";
  let separator = "";
  columns.forEach((column, index) => {
    const width = maxColumnWidths[column];
    const paddedValue = column.padEnd(width);
    const separatorLine = "─".repeat(width);
    header += index === 0 ? paddedValue : ` │ ${paddedValue}`;
    separator += index === 0 ? separatorLine : `─┼─${separatorLine}`;
  });
  nodes.push({
    display: `${header}`,
  });
  nodes.push({
    display: `${separator}`,
  });

  resources.forEach((resource: NodeParam) => {
    let display = "";
    columns.forEach((column, index) => {
      if (!resource) {
        return;
      }
      let value: string;
      const prop = resource[column as keyof typeof resource];
      if (
        u.isArrayOf(u.isObjectOf({
          name: u.isString,
        }))(prop)
      ) {
        value = (prop as { name: string }[]).flatMap((member) => {
          return member.name;
        }).join(", ");
      } else {
        value = (prop as string | Array<string> | Array<number>).toString();
      }
      const width = calculateStringWidth(value);
      const paddedValue = value.padEnd(
        maxColumnWidths[column] - (width - value.length),
      );
      display += index === 0 ? paddedValue : ` │ ${paddedValue}`;
    });

    nodes.push({
      display,
      params: { [resourceKind]: resource },
    });
  });

  return nodes;
};

const calculateStringWidth = (str: string): number => {
  let width = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    if (
      charCode >= 0x1100 &&
      (charCode <= 0x11FF || (charCode >= 0x2E80 && charCode <= 0xD7A3))
    ) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
};
