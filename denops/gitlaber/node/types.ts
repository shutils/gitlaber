import { unknownutil as u } from "../deps.ts";

import { isWiki } from "../client/types.ts";
import { isAction } from "../action/types.ts";
import {
  isBranch,
  isCommit,
  isIssue,
  isMember,
  isMergeRequest,
  isProject,
  isProjectLabel,
} from "../types.ts";

export const isNodeParam = u.isOptionalOf(u.isOneOf([
  isAction,
  isIssue,
  isBranch,
  isWiki,
  isCommit,
  isMember,
  isMergeRequest,
  isProject,
  isProjectLabel,
  u.isUnknown,
]));

export type NodeParam = u.PredicateType<typeof isNodeParam>;

export const isNode = u.isObjectOf({
  display: u.isString,
  params: u.isOptionalOf(u.isRecord),
});

export type Node = u.PredicateType<typeof isNode>;

export type ResourceKind = "project" | "issue" | "mr" | "wiki" | "branch" | "commit" | "member" | "label" | "action" | "job";
