import { unknownutil as u } from "./deps.ts";
import { isBranch, isIssue, isProject, isWiki, isMergeRequest } from "./client/index.ts";

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

const isNodeKind = u.isLiteralOneOf(
  ["other", "issue", "wiki", "branch", "mr"] as const,
);

export type NodeKind = u.PredicateType<typeof isNodeKind>;

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

const isBranchNode = u.isObjectOf({
  ...baseNode,
  kind: u.isLiteralOf("branch"),
  branch: isBranch,
});

export type BranchNode = u.PredicateType<typeof isBranchNode>;

const isWikiNode = u.isObjectOf({
  ...baseNode,
  kind: u.isLiteralOf("wiki"),
  wiki: isWiki,
});

export type WikiNode = u.PredicateType<typeof isWikiNode>;

const isMergeRequestNode = u.isObjectOf({
  ...baseNode,
  kind: u.isLiteralOf("mr"),
  mr: isMergeRequest,
});

export type MergeRequestNode = u.PredicateType<typeof isMergeRequestNode>;

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
