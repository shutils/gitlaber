import {
  BranchNode,
  GitlaberInstance,
  IssueNode,
  Node,
  WikiNode,
} from "./types.ts";

import { Branch, Issue, Project, Wiki } from "./client/index.ts";

export const createMainPanelNodes = (
  gitlaberInstance: GitlaberInstance,
  project: Project,
) => {
  const nodes: Array<Node> = [];
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
  const nodes: Array<Node | IssueNode> = [];
  let maxIidWidth = 1;
  issues.map((issue) => {
    if (maxIidWidth < issue.iid.toString().length) {
      maxIidWidth = issue.iid.toString().length;
    }
  });
  issues.map((issue) => {
    nodes.push({
      display: `# ${issue.iid} ${
        Array(maxIidWidth + 1 - issue.iid.toString().length).join(" ")
      } ${issue.title}`,
      kind: "issue",
      issue: issue,
    });
  });
  return nodes;
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
  const nodes: Array<Node | BranchNode> = [];
  branches.map((branch) => {
    nodes.push({
      display: branch.name,
      kind: "branch",
      branch: branch,
    });
  });
  return nodes;
};

export const createProjectWikiNodes = (
  wikis: Wiki[],
) => {
  const nodes: Array<Node | WikiNode> = [];
  let maxIidWidth = 1;
  wikis.map((wiki) => {
    if (maxIidWidth < wiki.title.toString().length) {
      maxIidWidth = wiki.title.toString().length;
    }
  });
  wikis.map((wiki) => {
    nodes.push({
      display: wiki.title,
      kind: "wiki",
      wiki: wiki,
    });
  });
  return nodes;
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
