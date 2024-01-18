import { unknownutil as u } from "../../deps.ts";

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
