import { unknownutil as u } from "../../deps.ts";

export const isProjectLabel = u.isObjectOf({
  id: u.isNumber,
  name: u.isString,
  ...u.isUnknown,
});

export type ProjectLabel = u.PredicateType<typeof isProjectLabel>;
