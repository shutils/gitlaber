import { unknownutil as u } from "./deps.ts";

const isGitlaberState = u.isObjectOf({
  has_main_panel: u.isBoolean,
  has_issue_panel: u.isBoolean,
  has_wiki_panel: u.isBoolean,
  ...u.isUnknown,
});

export type GitlaberState = u.PredicateType<typeof isGitlaberState>;

const isLinks = u.isObjectOf({
  self: u.isString,
  issues: u.isString,
  merge_requests: u.isString,
  repo_branches: u.isString,
  labels: u.isString,
  events: u.isString,
  members: u.isString,
  cluster_agents: u.isString,
  ...u.isUnknown,
});

export type Links = u.PredicateType<typeof isLinks>;

const isIssueState = u.isLiteralOneOf(["opened", "closed"] as const);

export type IssueState = u.PredicateType<typeof isIssueState>;

const isNodeKind = u.isLiteralOneOf(["other", "issue", "wiki"] as const);

export type NodeKind = u.PredicateType<typeof isNodeKind>;

export const isProject = u.isObjectOf({
  id: u.isNumber,
  description: u.isOneOf([u.isString, u.isNull]),
  web_url: u.isString,
  name: u.isString,
  open_issues_count: u.isNumber,
  created_at: u.isString,
  updated_at: u.isOptionalOf(u.isString),
  default_branch: u.isString,
  issue_branch_template: u.isOneOf([u.isString, u.isNull]),
  _links: u.isObjectOf({
    self: u.isString,
    issues: u.isString,
    merge_requests: u.isString,
    repo_branches: u.isString,
    labels: u.isString,
    events: u.isString,
    members: u.isString,
    cluster_agents: u.isString,
    ...u.isUnknown,
  }),
  ...u.isUnknown,
});

export type Project = u.PredicateType<typeof isProject>;

export const isIssue = u.isObjectOf({
  id: u.isNumber,
  iid: u.isNumber,
  description: u.isOneOf([u.isString, u.isNull]),
  state: isIssueState,
  labels: u.isArrayOf(u.isString),
  title: u.isString,
  created_at: u.isString,
  updated_at: u.isString,
  web_url: u.isString,
  _links: u.isObjectOf({
    self: u.isString,
    notes: u.isString,
    award_emoji: u.isString,
    project: u.isString,
    ...u.isUnknown,
  }),
  ...u.isUnknown,
});

export type Issue = u.PredicateType<typeof isIssue>;

const isWiki = u.isObjectOf({
  content: u.isString,
  format: u.isString,
  slug: u.isString,
  title: u.isString,
  encoding: u.isString,
  ...u.isUnknown,
});

export type Wiki = u.PredicateType<typeof isWiki>;

const isWikiGetAttributes = u.isObjectOf({
  id: u.isNumber,
  slug: u.isString,
  render_html: u.isOptionalOf(u.isBoolean),
  version: u.isOptionalOf(u.isString),
  ...u.isUnknown,
});

export type WikiGetAttributes = u.PredicateType<typeof isWikiGetAttributes>;

const isWikiGetPageAttributes = u.isObjectOf({
  id: u.isNumber,
  with_content: u.isOptionalOf(u.isBoolean),
  ...u.isUnknown,
});

export type WikisGetAttributes = u.PredicateType<
  typeof isWikiGetPageAttributes
>;

const isWikiCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  content: u.isString,
  title: u.isString,
  format: u.isOptionalOf(
    u.isLiteralOneOf(["markdown", "rdoc", "asciidoc", "org"] as const),
  ),
  ...u.isUnknown,
});

export type WikiCreateAttributes = u.PredicateType<
  typeof isWikiCreateAttributes
>;

const isWikiEditAttributes = u.isObjectOf({
  id: u.isNumber,
  content: u.isString,
  title: u.isString,
  format: u.isOptionalOf(
    u.isLiteralOneOf(["markdown", "rdoc", "asciidoc", "org"] as const),
  ),
  slug: u.isString,
  ...u.isUnknown,
});

export type WikiEditAttributes = u.PredicateType<typeof isWikiEditAttributes>;

const isWikiDeleteAttributes = u.isObjectOf({
  id: u.isNumber,
  slug: u.isString,
  ...u.isUnknown,
});

export type WikiDeleteAttributes = u.PredicateType<
  typeof isWikiDeleteAttributes
>;

const isIssueCreateNewAttributes = u.isObjectOf({
  id: u.isNumber,
  title: u.isOptionalOf(u.isString),
  description: u.isOptionalOf(u.isString),
  iid: u.isOptionalOf(u.isNumber),
});

export type IssueCreateNewAttributes = u.PredicateType<
  typeof isIssueCreateNewAttributes
>;

const isIssueCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  issue_iid: u.isNumber,
  add_labels: u.isOptionalOf(u.isString),
  confidential: u.isOptionalOf(u.isBoolean),
  description: u.isOptionalOf(u.isString),
  discussion_locked: u.isOptionalOf(u.isBoolean),
  due_date: u.isOptionalOf(u.isString),
  epic_id: u.isOptionalOf(u.isNumber),
  epic_iid: u.isOptionalOf(u.isNumber),
  issue_type: u.isOptionalOf(
    u.isLiteralOneOf(["issue", "incident", "test_case", "task"] as const),
  ),
  labels: u.isOptionalOf(u.isString),
  milestone_id: u.isOptionalOf(u.isNumber),
  remove_labels: u.isOptionalOf(u.isString),
  state_event: u.isOptionalOf(u.isLiteralOneOf(["close", "reopen"] as const)),
  title: u.isOptionalOf(u.isString),
  updated_at: u.isOptionalOf(u.isString),
  weight: u.isOptionalOf(u.isNumber),
});

export type IssueEditAttributes = u.PredicateType<
  typeof isIssueCreateAttributes
>;

const isBranchCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  branch: u.isString,
  ref: u.isString,
});

export type BranchCreateAttributes = u.PredicateType<
  typeof isBranchCreateAttributes
>;

const baseNode = {
  display: u.isString,
  kind: isNodeKind,
};

const isBaseNode = u.isObjectOf(baseNode);

export type BaseNode = u.PredicateType<typeof isBaseNode>;

const isNode = u.isObjectOf({
  ...baseNode,
  ...u.isUnknown,
});

export type Node = u.PredicateType<typeof isNode>;

const isIssueNode = u.isObjectOf({
  ...baseNode,
  kind: u.isLiteralOf("issue"),
  issue: isIssue,
});

export type IssueNode = u.PredicateType<typeof isIssueNode>;

const isWikiNode = u.isObjectOf({
  ...baseNode,
  kind: u.isLiteralOf("wiki"),
  wiki: isWiki,
});

export type WikiNode = u.PredicateType<typeof isWikiNode>;

const isGitlaberInstance = u.isObjectOf({
  index: u.isNumber,
  cwd: u.isString,
  url: u.isString,
  token: u.isString,
  project: isProject,
  issues: u.isOptionalOf(u.isArrayOf(isIssue)),
  wikis: u.isOptionalOf(u.isArrayOf(isWiki)),
});

export type GitlaberInstance = u.PredicateType<typeof isGitlaberInstance>;

export const isGitlaberVar = u.isArrayOf(isGitlaberInstance);

export type GitlaberVar = u.PredicateType<typeof isGitlaberVar>;
