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
  approved: u.isOptionalOf(u.isBoolean),
  diff_refs: u.isOptionalOf(u.isObjectOf({
    base_sha: u.isString,
    head_sha: u.isString,
    start_sha: u.isString,
    ...u.isUnknown,
  })),
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

export const isChange = u.isObjectOf({
  old_path: u.isString,
  new_path: u.isString,
  a_mode: u.isString,
  b_mode: u.isString,
  diff: u.isString,
  new_file: u.isBoolean,
  renamed_file: u.isBoolean,
  deleted_file: u.isBoolean,
  ...u.isUnknown,
});

export const isMergeRequestChange = u.isObjectOf({
  id: u.isNumber,
  iid: u.isNumber,
  title: u.isString,
  changes: u.isArrayOf(isChange),
  ...u.isUnknown,
});
