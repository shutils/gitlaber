import { unknownutil as u } from "../../deps.ts";

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
  labels: u.isArrayOf(u.isString),
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
