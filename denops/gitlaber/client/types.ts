import { unknownutil as u } from "../deps.ts";

export * from "./branch/types.ts";
export * from "./commit/types.ts";
export * from "./issue/types.ts";
export * from "./label/types.ts";
export * from "./member/types.ts";
export * from "./mr/types.ts";
export * from "./project/types.ts";
export * from "./wiki/types.ts";
export * from "./lint/types.ts";
export * from "./discussion/types.ts";
export * from "./job/types.ts";

export const isPaginationAttributes = u.isObjectOf({
  page: u.isOptionalOf(u.isNumber),
  per_page: u.isOptionalOf(u.isNumber),
});

export type PaginationAttributes = u.PredicateType<
  typeof isPaginationAttributes
>;
