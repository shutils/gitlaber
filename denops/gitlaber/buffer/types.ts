import { Denops, unknownutil as u } from "../deps.ts";

import { isNode, Keymap, Node } from "../types.ts";

export const BUFFER_KINDS = [
  "GitlaberMain",
  "GitlaberPopupIssue",
  "GitlaberPopupBranch",
  "GitlaberPopupWiki",
  "GitlaberPopupMr",
  "GitlaberResourceIssues",
  "GitlaberResourceBranches",
  "GitlaberResourceWikis",
  "GitlaberResourceMrs",
  "GitlaberPreviewIssue",
  "GitlaberPreviewWiki",
  "GitlaberPreviewMr",
  "GitlaberEditIssue",
  "GitlaberEditWiki",
  "GitlaberEditMr",
  "GitlaberCreateWiki",
] as const;

export const isBufferKind = u.isLiteralOneOf(BUFFER_KINDS);

export type BufferKind = u.PredicateType<typeof isBufferKind>;

export const isBuffer = u.isObjectOf({
  bufnr: u.isNumber,
  kind: isBufferKind,
  nodes: u.isArrayOf(isNode),
});

export type Buffer = u.PredicateType<typeof isBuffer>;

export type BufferConfig = {
  kind: BufferKind;
  nodeMaker: (denops: Denops) => Promise<Node[]>;
  options?: BufferOptions;
};

export type BufferOptions = {
  buftype?: string;
  modifiable?: boolean;
  filetype?: string;
  keymaps?: Keymap[];
};
