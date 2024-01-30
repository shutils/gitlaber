import { unknownutil as u } from "../../deps.ts";

export const isNote = u.isObjectOf({
  id: u.isNumber,
  type: u.isOneOf([u.isString, u.isNull]),
  body: u.isOneOf([u.isString, u.isNull]),
  author: u.isObjectOf({
    id: u.isNumber,
    name: u.isString,
    username: u.isString,
    ...u.isUnknown,
  }),
  system: u.isBoolean,
  // noteable_id: u.isNumber,
  // project_id: u.isNumber,
  // resolvable: u.isOptionalOf(u.isBoolean),
  // resolved: u.isOptionalOf(u.isBoolean),
  // resolved_by: u.isOptionalOf(u.isObjectOf({
  //   id: u.isNumber,
  //   name: u.isString,
  //   username: u.isString,
  //   ...u.isUnknown,
  // })),
  position: u.isOptionalOf(u.isObjectOf({
    base_sha: u.isString,
    start_sha: u.isString,
    head_sha: u.isString,
    old_path: u.isOptionalOf(u.isString),
    new_path: u.isOptionalOf(u.isString),
    position_type: u.isString,
    old_line: u.isOneOf([u.isNumber, u.isNull]),
    new_line: u.isOneOf([u.isNumber, u.isNull]),
    ...u.isUnknown,
  })),
  ...u.isUnknown,
});

export const isDiscussion = u.isObjectOf({
  id: u.isString,
  // individual_note: u.isBoolean,
  notes: u.isArrayOf(isNote),
  ...u.isUnknown,
});

export type Discussion = u.PredicateType<typeof isDiscussion>;
