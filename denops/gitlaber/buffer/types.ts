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
  "GitlaberJobList",
  "GitlaberIssuePreview",
  "GitlaberIssueEdit",
  "GitlaberMrPreview",
  "GitlaberMrEdit",
  "GitlaberWikiPreview",
  "GitlaberWikiEdit",
  "GitlaberWikiNew",
  "GitlaberUiSelect",
  "GitlaberUiInput",
  "GitlaberMergedYaml",
  "GitlaberMrChangeList",
  "GitlaberDiffOldFile",
  "GitlaberDiffNewFile",
  "GitlaberMrDiscussion",
  "GitlaberMrDiscussionInspect",
  "GitlaberJobLog",
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
  seed: u.isOptionalOf(u.isRecord),
});

export type Buffer = u.PredicateType<typeof isBuffer>;

export type BufferConfig = {
  kind: BufferKind;
  direction: BufferDirection;
  nodeMaker?: (
    denops: Denops,
    seed?: Record<string, unknown>,
  ) => Promise<Node[]>;
  options?: BufferOptions;
  keymaps?: Keymap[];
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
  "horizontal belowright",
] as const;

export const isBufferDirection = u.isLiteralOneOf(BufferDirections);

export type BufferDirection = u.PredicateType<typeof isBufferDirection>;

export * from "./seed.ts";
