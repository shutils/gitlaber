import { Denops, unknownutil as u } from "../deps.ts";
import { Context, Node } from "../types.ts";

export const actionNames = [
  "branch:browse",
  "branch:config",
  "branch:list",
  "branch:new",
  "issue:assign",
  "issue:browse",
  "issue:close",
  "issue:config",
  "issue:delete",
  "issue:edit",
  "issue:_edit",
  "issue:label",
  "issue:list",
  "issue:new",
  "issue:preview",
  "issue:reopen",
  "issue:unlabel",
  "mr:approve",
  "mr:assign:assignee",
  "mr:assign:reviewer",
  "mr:browse",
  "mr:close",
  "mr:config",
  "mr:delete",
  "mr:edit",
  "mr:_edit",
  "mr:label",
  "mr:list",
  "mr:merge",
  "mr:new",
  "mr:preview",
  "mr:reopen",
  "mr:unapprove",
  "mr:unlabel",
  "project:browse",
  "project:status",
  "wiki:browse",
  "wiki:config",
  "wiki:delete",
  "wiki:edit",
  "wiki:_edit",
  "wiki:list",
  "wiki:new",
  "wiki:_new",
  "wiki:preview",
  "util:echo:node",
  "ui:select",
] as const;

export type ActionName = typeof actionNames[number];

export type ActionStore = {
  [key in ActionName]: (
    args: ActionArgs,
  ) => Promise<void>;
};

export type ActionArgs = {
  denops: Denops;
  ctx: Context;
  node?: Node;
  params?: Record<string, unknown>;
};

export const isAction = u.isObjectOf({
  name: u.isLiteralOneOf(actionNames),
  params: u.isOptionalOf(u.isUnknown),
});

export type Action = u.PredicateType<typeof isAction>;
