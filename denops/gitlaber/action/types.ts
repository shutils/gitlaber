import { Denops, unknownutil as u } from "../deps.ts";
import { Context, Node } from "../types.ts";

export const actionNames = [
  "branch-browse",
  "branch-config",
  "branch-list",
  "branch-list-next",
  "branch-list-prev",
  "branch-new",
  "issue-assign",
  "issue-browse",
  "issue-close",
  "issue-config",
  "issue-delete",
  "issue-edit",
  "issue-edit-submit",
  "issue-label",
  "issue-list",
  "issue-list-next",
  "issue-list-prev",
  "issue-new",
  "issue-preview",
  "issue-reopen",
  "issue-unlabel",
  "mr-approve",
  "mr-assign-assignee",
  "mr-assign-reviewer",
  "mr-browse",
  "mr-close",
  "mr-config",
  "mr-delete",
  "mr-edit",
  "mr-edit-submit",
  "mr-label",
  "mr-list",
  "mr-merge",
  "mr-new",
  "mr-preview",
  "mr-reopen",
  "mr-unapprove",
  "mr-unlabel",
  "mr-change-list",
  "mr-change-diff",
  "mr-discussion-new",
  "mr-discussion-new-overview",
  "mr-discussion-inspect",
  "mr-discussion-add-note",
  "mr-discussion-resolve",
  "mr-discussion-open",
  "mr-discussion-toggle",
  "project-browse",
  "project-status",
  "pipeline-list",
  "pipeline-browse",
  "wiki-browse",
  "wiki-config",
  "wiki-delete",
  "wiki-edit",
  "wiki-edit-submit",
  "wiki-list",
  "wiki-new",
  "wiki-new-submit",
  "wiki-preview",
  "job-list",
  "job-list-for-pipeline",
  "job-browse",
  "job-log",
  "util-echo-node",
  "util-echo-keymaps",
  "ui-select",
  "ui-input",
  "ci-lint",
  "buffer-close",
  "buffer-hide",
  "buffer-close-all",
  "buffer-reload",
] as const;

export const isActionName = u.isLiteralOneOf(actionNames);

export type ActionName = u.PredicateType<typeof isActionName>;

export type ActionStore = {
  [key in ActionName]: (
    args: ActionArgs,
  ) => Promise<void>;
};

export type ActionArgs = {
  denops: Denops;
  ctx: Context;
  node?: Node;
  name: ActionName;
  params?: Record<string, unknown>;
};

export const isAction = u.isObjectOf({
  name: u.isLiteralOneOf(actionNames),
  params: u.isOptionalOf(u.isUnknown),
});

export type Action = u.PredicateType<typeof isAction>;
