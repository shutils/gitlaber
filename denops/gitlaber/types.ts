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

type NodeKind = "other" | "issue" | "wiki";

export type Project = {
  id: number;
  description: string;
  name: string;
  open_issues_count: number;
  created_at: string;
  updated_at: string;
  issue_branch_template: string;
  _links: Links;
};

export type Issue = {
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

export type Wiki = {
  content: string;
  format: string;
  slug: string;
  title: string;
  encoding: string;
};

export type WikiGetAttributes = {
  id: number;
  slug: string;
  render_html?: boolean;
  version?: string;
};

export type WikisGetAttributes = {
  id: number;
  with_content?: boolean;
};

export type WikiCreateAttributes = {
  id: number | string;
  content: string;
  title: string;
  format?: "markdown" | "rdoc" | "asciidoc" | "org";
};

export type WikiEditAttributes = {
  id: number | string;
  content: string;
  title: string;
  format?: "markdown" | "rdoc" | "asciidoc" | "org";
  slug: string;
};

export type WikiDeleteAttributes = {
  id: number | string;
  slug: string;
};

export type IssueCreateNewAttributes = {
  id: number;
  title?: string;
  description?: string;
  iid?: number;
};

export type IssueEditAttributes = {
  id: number;
  issue_iid: number;
  add_labels?: string;
  assignee_ids?: number[];
  confidential?: boolean;
  description?: string;
  discussion_locked?: boolean;
  due_data?: string;
  epic_id?: number;
  epic_iid?: number;
  issue_type?: "issue" | "incident" | "test_case" | "task";
  labels?: string;
  milestone_id?: number;
  remove_labels?: string;
  state_event?: "close" | "reopen";
  title?: string;
  updated_at?: string;
  weight?: number;
};

export type BaseNode = {
  display: string;
  kind: NodeKind;
};

export type IssueNode = BaseNode & {
  issue: Issue;
};

export type WikiNode = BaseNode & {
  wiki: Wiki;
};
