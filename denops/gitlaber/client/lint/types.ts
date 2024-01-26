import { unknownutil as u } from "../../deps.ts";

export const isLint = u.isObjectOf({
  valid: u.isBoolean,
  merged_yaml: u.isOneOf([u.isString, u.isNull]),
  errors: u.isArrayOf(u.isString),
  warnings: u.isArrayOf(u.isString),
  ...u.isUnknown,
});

export type Lint = u.PredicateType<typeof isLint>;
