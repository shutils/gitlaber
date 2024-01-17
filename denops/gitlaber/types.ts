import { Denops, mapping, unknownutil as u } from "./deps.ts";
import {
  isBranch,
  isIssue,
  isMergeRequest,
  isProject,
  isWiki,
} from "./client/types.ts";
export * from "./client/types.ts";

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

const isResourceKind = u.isLiteralOneOf(
  [
    "issue",
    "branch",
    "wiki",
    "merge_request",
    "other",
  ] as const,
);

export type ResourceKind = u.PredicateType<typeof isResourceKind>;

export type NodeKind = u.PredicateType<typeof isNodeKind>;

export const isResource = u.isOneOf([
  isIssue,
  isBranch,
  isWiki,
  isMergeRequest,
]);

export type Resource = u.PredicateType<typeof isResource>;

export const isNode = u.isObjectOf({
  display: u.isString,
  kind: isNodeKind,
  resource: u.isOptionalOf(isResource),
});

export type Node = u.PredicateType<typeof isNode>;

export type Mapping = {
  lhs: string;
  rhs: string;
  option?: mapping.MapOptions;
  description?: string;
};

const isBufferKind = u.isLiteralOneOf(
  [
    "base",
    "main",
    "project_issue",
    "project_issues",
    "project_branch",
    "project_branches",
    "project_wiki",
    "project_wikis",
    "project_merge_request",
    "project_merge_requests",
    "issue_edit",
    "issue_preview",
    "merge_request_edit",
    "merge_request_preview",
    "wiki_create",
    "wiki_edit",
    "wiki_preview",
  ] as const,
);

export type BufferKind = u.PredicateType<typeof isBufferKind>;

export const isBufferOptions = u.isObjectOf({
  nofile: u.isOptionalOf(u.isBoolean),
  nomodifiable: u.isOptionalOf(u.isBoolean),
  filetype: u.isOptionalOf(u.isString),
});

export type BufferOptions = u.PredicateType<typeof isBufferOptions>;

export type BufferConfig = {
  direction: string;
  options: BufferOptions;
  node_creater: (denops: Denops, ctx?: Ctx) => Promise<Node[]>;
  tmp?: boolean;
};

export type BufferInfo = {
  buffer_kind: BufferKind;
  resource_kind: ResourceKind;
  config: BufferConfig;
  params?: {
    user_input: {
      [key: string]: unknown;
    };
  };
  autocmd?: (params: { [key: string]: unknown }) => Promise<void>;
  keymaps: Mapping[];
};

export const isGitlaberInstance = u.isObjectOf({
  cwd: u.isString,
  url: u.isString,
  token: u.isString,
  project: isProject,
  issues: u.isOptionalOf(u.isArrayOf(isIssue)),
  wikis: u.isOptionalOf(u.isArrayOf(isWiki)),
  buffers: u.isArrayOf(u.isObjectOf({
    resource_kind: isResourceKind,
    bufnr: u.isNumber,
  })),
  recent_resource: u.isOptionalOf(isResourceKind),
});

export type GitlaberInstance = u.PredicateType<typeof isGitlaberInstance>;

export const isGitlaberVar = u.isObjectOf({
  instances: u.isArrayOf(isGitlaberInstance),
  recent_instance_index: u.isNumber,
});

export type GitlaberVar = u.PredicateType<typeof isGitlaberVar>;

export type Ctx = {
  instance: GitlaberInstance;
  nodes: Node[];
};
