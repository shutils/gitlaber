import { unknownutil as u } from "../../deps.ts";

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
