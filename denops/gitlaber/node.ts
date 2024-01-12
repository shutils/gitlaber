import { unknownutil as u } from "./deps.ts";
import { GitlaberInstance, Node, NodeKind } from "./types.ts";

import {
  Branch,
  Issue,
  Member,
  MergeRequest,
  Project,
  Wiki,
} from "./client/index.ts";

export const createMainPanelNodes = (
  gitlaberInstance: GitlaberInstance,
  project: Project,
) => {
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
  return nodes;
};

export const createProjectIssuePanelNodes = () => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project issue Panel",
    kind: "other",
  });
  return nodes;
};

export const createProjectIssuesNodes = (
  issues: Issue[],
) => {
  return createNodes(
    issues,
    ["iid", "title", "labels", "state", "assignees"],
    "issue",
  );
};

export const createProjectBranchPanelNodes = () => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project branch Panel",
    kind: "other",
  });
  return nodes;
};

export const createProjectBranchesNodes = (
  branches: Branch[],
) => {
  return createNodes(branches, ["name", "merged"], "branch");
};

export const createProjectWikiNodes = (
  wikis: Wiki[],
) => {
  return createNodes(wikis, ["title", "format"], "wiki");
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

export const createProjectWikiPanelNodes = () => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project wiki Panel",
    kind: "other",
  });
  return nodes;
};

export const createProjectWikiContentNodes = (
  wiki: Wiki,
) => {
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

export const createProjectMergeRequestPanelNodes = () => {
  const nodes: Array<Node> = [];
  nodes.push({
    display: "Project merge request Panel",
    kind: "other",
  });
  return nodes;
};

export const createProjectMergeRequestsNodes = (
  mrs: MergeRequest[],
): Node[] => {
  return createNodes(
    mrs,
    ["iid", "title", "state", "assignees", "reviewers"],
    "mr",
  );
};

export const createNodes = (
  records: Record<string, unknown>[],
  columns: string[],
  kind: NodeKind,
): Node[] => {
  const nodes: Array<Node> = [];

  const maxColumnWidths: Record<string, number> = {};
  columns.forEach((column) => {
    maxColumnWidths[column] = Math.max(column.length, 1);
    records.forEach((record) => {
      if (
        u.isObjectOf({ ...u.isUnknown })(record[column])
      ) {
        throw new Error(
          `A column has been specified that cannot be displayed: ${column}`,
        );
      }
      const value = (record[column] as string).toString();
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

  records.forEach((record) => {
    let display = "";
    columns.forEach((column, index) => {
      if (
        u.isObjectOf({ ...u.isUnknown })(record[column])
      ) {
        throw new Error(
          `A column has been specified that cannot be displayed: ${column}`,
        );
      }
      let value: string;
      if (column === "assignees" || column === "reviewers") {
        value = (record[column] as Member[]).flatMap((member) => {
          return member.name;
        }).join(", ");
      } else {
        value = (record[column] as string).toString();
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
      [kind]: record,
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
