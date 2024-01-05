type Links = {
  self: string;
  issues: string;
  merge_requests: string;
  repo_branches: string;
  labels: string;
  events: string;
  members: string;
  cluster_agents: string;
};

type IssueState = "open" | "closed";

type NodeKind = "other" | "issue";

export type SingleProjectResponse = {
  id: number;
  description: string;
  name: string;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  issue_branch_template: string;
  _links: Links;
};

export type IssueResponse = {
  id: number;
  iid: number;
  description: string;
  state: IssueState;
  labels: string[];
  title: string;
  created_at: string;
  updated_at: string;
  web_url: string;
  _links: Links;
};

export type NewIssueAttributes = {
  id: number;
  title?: string;
  description?: string;
  iid?: number;
};

export type BaseNode = {
  display: string;
  kind: NodeKind;
};

export type IssueNode = BaseNode & {
  issue: IssueResponse;
};
