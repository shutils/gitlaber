import { unknownutil as u } from "../deps.ts";

import { isWiki } from "../client/types.ts";
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
  isIssue,
  isBranch,
  isWiki,
  isCommit,
  isMember,
  isMergeRequest,
  isProject,
  isProjectLabel,
]));

export type NodeParam = u.PredicateType<typeof isNodeParam>;

export const isNode = u.isObjectOf({
  display: u.isString,
  params: isNodeParam,
});

export type Node = u.PredicateType<typeof isNode>;
