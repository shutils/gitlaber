import { unknownutil as u } from "../deps.ts";

export const isBranch = u.isObjectOf({
  name: u.isString,
  merged: u.isBoolean,
  protected: u.isBoolean,
  default: u.isBoolean,
  developers_can_push: u.isBoolean,
  developers_can_merge: u.isBoolean,
  can_push: u.isBoolean,
  web_url: u.isString,
  commit: u.isObjectOf({
    id: u.isString,
    short_id: u.isString,
    created_at: u.isString,
    parent_ids: u.isArrayOf(u.isString),
    title: u.isString,
    message: u.isString,
    author_name: u.isString,
    author_email: u.isString,
    authored_date: u.isString,
    committer_name: u.isString,
    committer_email: u.isString,
    committed_date: u.isString,
    web_url: u.isString,
    ...u.isUnknown,
  }),
  ...u.isUnknown,
});

export type Branch = u.PredicateType<typeof isBranch>;

export const isCommit = u.isObjectOf({
  id: u.isString,
  short_id: u.isString,
  title: u.isString,
  author_name: u.isString,
  author_email: u.isString,
  committer_name: u.isString,
  committer_email: u.isString,
  created_at: u.isString,
  message: u.isString,
  committed_date: u.isString,
  parent_ids: u.isArrayOf(u.isString),
  ...u.isUnknown,
});

export type Commit = u.PredicateType<typeof isCommit>;

const isIssueState = u.isLiteralOneOf(["opened", "closed"] as const);

export type IssueState = u.PredicateType<typeof isIssueState>;

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

export const isProjectLabel = u.isObjectOf({
  id: u.isNumber,
  name: u.isString,
  ...u.isUnknown,
});

export type ProjectLabel = u.PredicateType<typeof isProjectLabel>;

export const isMember = u.isObjectOf({
  id: u.isNumber,
  username: u.isString,
  name: u.isString,
  ...u.isUnknown,
});

export type Member = u.PredicateType<typeof isMember>;

export const isMergeRequest = u.isObjectOf({
  id: u.isNumber,
  iid: u.isNumber,
  title: u.isString,
  description: u.isOneOf([u.isString, u.isNull]),
  target_branch: u.isString,
  source_branch: u.isString,
  draft: u.isBoolean,
  web_url: u.isString,
  squash: u.isBoolean,
  approved: u.isBoolean,
  assignees: u.isArrayOf(
    u.isObjectOf({
      username: u.isString,
      name: u.isString,
      ...u.isUnknown,
    }),
  ),
  reviewers: u.isArrayOf(
    u.isObjectOf({
      username: u.isString,
      name: u.isString,
      ...u.isUnknown,
    }),
  ),
  ...u.isUnknown,
});

export type MergeRequest = u.PredicateType<typeof isMergeRequest>;

export const isProject = u.isObjectOf({
  id: u.isNumber,
  description: u.isOneOf([u.isString, u.isNull]),
  web_url: u.isString,
  name: u.isString,
  path: u.isString,
  path_with_namespace: u.isString,
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

export const isWiki = u.isObjectOf({
  content: u.isString,
  format: u.isString,
  slug: u.isString,
  title: u.isString,
  encoding: u.isString,
  ...u.isUnknown,
});

export type Wiki = u.PredicateType<typeof isWiki>;
