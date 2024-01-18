import { unknownutil as u } from "../../deps.ts";

export const isWiki = u.isObjectOf({
  content: u.isString,
  format: u.isString,
  slug: u.isString,
  title: u.isString,
  encoding: u.isString,
  ...u.isUnknown,
});

export type Wiki = u.PredicateType<typeof isWiki>;
