import { unknownutil as u } from "./deps.ts";

import { isBuffer } from "./buffer/types.ts";
import { isProject } from "./client/types.ts";

export const isInstance = u.isObjectOf({
  cwd: u.isString,
  bufnrs: u.isArrayOf(u.isNumber),
  project: isProject,
});

export type Instance = u.PredicateType<typeof isInstance>;

export const isGitlaberVar = u.isObjectOf({
  instances: u.isArrayOf(isInstance),
  buffers: u.isArrayOf(isBuffer),
});

export type GitlaberVar = u.PredicateType<typeof isGitlaberVar>;

export * from "./client/types.ts";
export * from "./node/types.ts";
export * from "./keymap/types.ts";
