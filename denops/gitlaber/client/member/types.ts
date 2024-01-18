import { unknownutil as u } from "../../deps.ts";

export const isMember = u.isObjectOf({
  id: u.isNumber,
  username: u.isString,
  name: u.isString,
  ...u.isUnknown,
});

export type Member = u.PredicateType<typeof isMember>;
