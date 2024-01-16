import { Denops, unknownutil as u } from "../../deps.ts";
import { Ctx, Node, NodeKind, Resource } from "../../types.ts";
import * as client from "../../client/index.ts";

import { Issue, Wiki } from "../../client/index.ts";
import { getCurrentGitlaberInstance, getCurrentNode } from "../../helper.ts";

export const createMainPanelNodes = async (
  denops: Denops,
  _ctx?: Ctx,
) => {
  const gitlaberInstance = await getCurrentGitlaberInstance(denops);
  const project = gitlaberInstance.project;
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Hint: Type g? to display the keymap for each panel.",
    kind: "other",
  });
  nodes.push({
    display: "",
    kind: "other",
  });
  nodes.push({
    display: "Main Panel",
    kind: "other",
  });
  nodes.push({
    display: "",
    kind: "other",
  });
  nodes.push({
    display: `cwd: ${gitlaberInstance.cwd}`,
    kind: "other",
  });
  nodes.push({
    display: `id: ${project.id}`,
    kind: "other",
  });
  nodes.push({
    display: `name: ${project.name}`,
    kind: "other",
  });
  nodes.push({
    display: `description: ${project.description}`,
    kind: "other",
  });
  nodes.push({
    display: `created_at: ${project.created_at}`,
    kind: "other",
  });
  nodes.push({
    display: `updated_at: ${project.updated_at}`,
    kind: "other",
  });
  nodes.push({
    display: `open_issues_count: ${project.open_issues_count}`,
    kind: "other",
  });
  return await Promise.resolve(nodes);
};

export const createProjectIssuePanelNodes = async (
  _denops: Denops,
  _ctx?: Ctx,
) => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project issue Panel",
    kind: "other",
  });
  return await Promise.resolve(nodes);
};

export const createProjectIssuesNodes = async (
  _denops: Denops,
  ctx?: Ctx,
) => {
  if (ctx === undefined) {
    return Promise.resolve([]);
  }
  const { project, url, token } = ctx.instance;
  const projectIssues = await client.getProjectIssues(
    url,
    token,
    project.id,
  );
  return Promise.resolve(createNodes(
    projectIssues,
    ["iid", "title", "labels", "state", "assignees"],
    "issue",
  ));
};

export const createProjectBranchPanelNodes = async (
  _denops: Denops,
  _ctx?: Ctx,
) => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project branch Panel",
    kind: "other",
  });
  return await Promise.resolve(nodes);
};

export const createProjectBranchesNodes = async (
  _denops: Denops,
  ctx?: Ctx,
) => {
  if (ctx === undefined) {
    return Promise.resolve([]);
  }
  const { project, url, token } = ctx.instance;
  const projectBranches = await client.getProjectBranches(url, token, {
    id: project.id,
  });
  return await Promise.resolve(
    createNodes(projectBranches, ["name", "merged"], "branch"),
  );
};

export const createProjectWikiNodes = async (
  _denops: Denops,
  ctx?: Ctx,
) => {
  if (ctx === undefined) {
    return Promise.resolve([]);
  }
  const { project, url, token } = ctx.instance;
  const projectWikis = await client.getProjectWikis(url, token, {
    id: project.id,
  });
  return await Promise.resolve(
    createNodes(projectWikis, ["title", "format"], "wiki"),
  );
};

export const createProjectIssueDescriptionNodes = (
  issue: Issue,
) => {
  const nodes: Array<Node> = [];
  if (issue.description === null) {
    return nodes;
  }
  const lines = issue.description.split("\n");
  lines.map((line) => {
    nodes.push({
      display: line,
      kind: "other",
    });
  });
  return nodes;
};

export const createPreviewNodes = async (
  denops: Denops,
  ctx?: Ctx,
) => {
  if (ctx === undefined) {
    return Promise.resolve([]);
  }
  const nodes: Array<Node> = [];
  const currentNode = await getCurrentNode(denops, ctx);
  if (
    currentNode?.resource === undefined ||
    !("description" in currentNode?.resource) ||
    currentNode.resource.description === null
  ) {
    return await Promise.resolve(nodes);
  }
  const lines = currentNode.resource.description.split("\n");
  lines.forEach((line) => {
    nodes.push({
      display: line,
      kind: "other",
    });
  });
  return await Promise.resolve(nodes);
};

export const createProjectWikiPanelNodes = async () => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project wiki Panel",
    kind: "other",
  });
  return await Promise.resolve(nodes);
};

export const createProjectWikiContentNodes = async (
  denops: Denops,
  ctx?: Ctx,
) => {
  if (ctx === undefined) {
    return Promise.resolve([]);
  }
  const currentNode = await getCurrentNode(denops, ctx);
  const wiki = currentNode.resource as Wiki;
  const lines = wiki.content.split("\n");
  const nodes: Array<Node> = [];
  lines.map((line) => {
    nodes.push({
      display: line,
      kind: "other",
    });
  });
  return nodes;
};

export const createProjectMergeRequestPanelNodes = async (
  _denops: Denops,
  _ctx?: Ctx,
) => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project merge request Panel",
    kind: "other",
  });
  return await Promise.resolve(nodes);
};

export const createProjectMergeRequestsNodes = async (
  _denops: Denops,
  ctx?: Ctx,
) => {
  if (ctx === undefined) {
    return Promise.resolve([]);
  }
  const { project, url, token } = ctx.instance;
  const projectMergeRequests = await client.getProjectMergeRequestsGraphQL(
    url,
    token,
    project.path_with_namespace,
    project.id,
  );
  return await Promise.resolve(createNodes(
    projectMergeRequests,
    ["iid", "title", "state", "assignees", "reviewers", "approved"],
    "mr",
  ));
};

export const createNodes = (
  resources: Resource[],
  columns: string[],
  kind: NodeKind,
): Node[] => {
  const nodes: Array<Node> = [];

  const maxColumnWidths: Record<string, number> = {};
  columns.forEach((column) => {
    maxColumnWidths[column] = Math.max(column.length, 1);
    resources.forEach((resource) => {
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
    const separatorLine = "-".repeat(width);
    header += index === 0 ? paddedValue : ` | ${paddedValue}`;
    separator += index === 0 ? separatorLine : ` | ${separatorLine}`;
  });
  nodes.push({
    display: `${header}`,
    kind: kind,
  });
  nodes.push({
    display: `${separator}`,
    kind: kind,
  });

  resources.forEach((resource: Resource) => {
    let display = "";
    columns.forEach((column, index) => {
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
      display += index === 0 ? paddedValue : ` | ${paddedValue}`;
    });

    nodes.push({
      display,
      kind: kind,
      resource: resource,
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
