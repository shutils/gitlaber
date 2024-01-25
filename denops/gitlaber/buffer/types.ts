import { Denops, unknownutil as u } from "../deps.ts";

import { isNode } from "../node/types.ts";
import { Keymap, Node } from "../types.ts";

export const BUFFER_KINDS = [
  "GitlaberProjectStatus",
  "GitlaberIssueConfig",
  "GitlaberBranchConfig",
  "GitlaberWikiConfig",
  "GitlaberMrConfig",
  "GitlaberIssueList",
  "GitlaberBranchList",
  "GitlaberWikiList",
  "GitlaberMrList",
  "GitlaberIssuePreview",
  "GitlaberIssueEdit",
] as const;

export const isBufferKind = u.isLiteralOneOf(BUFFER_KINDS);

export type BufferKind = u.PredicateType<typeof isBufferKind>;

export const isBuffer = u.isObjectOf({
  bufnr: u.isNumber,
  kind: isBufferKind,
  nodes: u.isArrayOf(isNode),
  params: u.isOptionalOf(u.isObjectOf({
    ...u.isUnknown,
  })),
});

export type Buffer = u.PredicateType<typeof isBuffer>;

export type BufferConfig = {
  kind: BufferKind;
  direction: BufferDirection;
  nodeMaker: (denops: Denops, seed?: Node) => Promise<Node[]>;
  options?: BufferOptions;
  keymaps?: Keymap[];
  tmp?: boolean;
};

export type BufferOptions = {
  buftype?: string;
  modifiable?: boolean;
  filetype?: string;
};

export const BufferDirections = [
  "tab",
  "botright",
  "aboveleft",
  "vertical botright",
] as const;

export const isBufferDirection = u.isLiteralOneOf(BufferDirections);

export type BufferDirection = u.PredicateType<typeof isBufferDirection>;
