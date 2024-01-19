import { Denops, unknownutil as u } from "./deps.ts";

import { isBuffer } from "./buffer/types.ts";
import { isProject } from "./client/types.ts";

export const isInstance = u.isObjectOf({
  cwd: u.isString,
  bufnrs: u.isArrayOf(u.isNumber),
  project: isProject,
  id: u.isNumber,
});

export type Instance = u.PredicateType<typeof isInstance>;

export const isGitlaberVar = u.isObjectOf({
  instances: u.isArrayOf(isInstance),
  buffers: u.isArrayOf(isBuffer),
});

export type GitlaberVar = u.PredicateType<typeof isGitlaberVar>;

export type Context = {
  denops: Denops;
  instance: Instance;
  url: string;
  token: string;
};

export * from "./client/types.ts";
export * from "./node/types.ts";
export * from "./keymap/types.ts";
export * from "./buffer/types.ts";
