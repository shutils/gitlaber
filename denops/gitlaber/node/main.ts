import { Denops, unknownutil as u } from "../deps.ts";
import * as client from "../client/index.ts";

import {
  Context,
  isMergeRequest,
  isPaginationAttributes,
  Lint,
  MergeRequest,
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
) => {
  return await makeNode(denops, async (args) => {
    const buffer = await getBuffer(args.denops);
    const pageAttrs = u.ensure(
      buffer.params,
      u.isOptionalOf(isPaginationAttributes),
    );
    const { instance, url, token } = args;
    const projectIssues = await client.getProjectIssues(
      url,
      token,
      {
        id: instance.project.id,
        ...pageAttrs,
      },
    );
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
) => {
  return await makeNode(denops, async (args) => {
    const buffer = await getBuffer(args.denops);
    const pageAttrs = u.ensure(
      buffer.params,
      u.isOptionalOf(isPaginationAttributes),
    );
    const { instance, url, token } = args;
    const projectBranches = await client.getProjectBranches(url, token, {
      id: instance.project.id,
      ...pageAttrs,
    });
    return await Promise.resolve(
      createNodes(projectBranches, "branch", ["name", "merged"]),
    );
  });
};

export const createWikiNodes = async (
  denops: Denops,
) => {
  return await makeNode(denops, async (args) => {
    const { instance, url, token } = args;
    const projectWikis = await client.getProjectWikis(url, token, {
      id: instance.project.id,
    });
    return await Promise.resolve(
      createNodes(projectWikis, "wiki", ["title", "format"]),
    );
  });
};

export const createDescriptionNodes = async (
  seed: {
    description: string | null;
    [key: string]: unknown;
  },
) => {
  const nodes: Node[] = [];
  if (seed.description === null) {
    return await Promise.resolve(nodes);
  }
  const lines = seed.description.split("\n");
  lines.map((line) => {
    nodes.push({
      display: line,
    });
  });
  return await Promise.resolve(nodes);
};

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
) => {
  return await makeNode(denops, async (args) => {
    const { instance, url, token } = args;
    const projectMergeRequests = await client.getProjectMergeRequestsGraphQL(
      url,
      token,
      instance.project.path_with_namespace,
      instance.project.id,
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
  return await makeNode(denops, async (args) => {
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

    let mr: MergeRequest;
    if (isMergeRequest(seed)) {
      mr = seed;
    } else if (isMergeRequest(args.node?.params?.mr)) {
      mr = args.node.params.mr;
    } else {
      throw new Error("MergeRequest not found.");
    }
    const { instance, url, token } = args;
    const projectMergeRequestChanges = await client
      .getProjectMergeRequestChanges(
        url,
        token,
        {
          id: instance.project.id,
          merge_request_iid: mr.iid,
        },
      );
    const nodes: Node[] = [];
    const changes = projectMergeRequestChanges.changes;
    changes.map((change) => {
      nodes.push({
        display: createDisplay(change),
        params: change,
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
