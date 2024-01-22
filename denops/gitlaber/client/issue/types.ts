import { unknownutil as u } from "../../deps.ts";

const ISSUE_STATE_KINDS = [
  "opened",
  "closed",
  "merged",
  "locked",
  "all",
] as const;

const ISSUE_SCOPE_KINDS = ["created_at", "assigned_to_me", "all"] as const;

export const isIssueGetAttributes = u.isObjectOf({
  state: u.isOptionalOf(u.isLiteralOneOf(ISSUE_STATE_KINDS)),
  scope: u.isOptionalOf(u.isLiteralOneOf(ISSUE_SCOPE_KINDS)),
  labels: u.isOptionalOf(u.isString),
});

export type IssueGetAttributes = u.PredicateType<typeof isIssueGetAttributes>;

const isIssueState = u.isLiteralOneOf(["opened", "closed"] as const);

export type IssueState = u.PredicateType<typeof isIssueState>;

export const isIssue = u.isObjectOf({
  id: u.isNumber,
  iid: u.isNumber,
  description: u.isOneOf([u.isString, u.isNull]),
  state: isIssueState,
  labels: u.isArrayOf(u.isString),
  title: u.isString,
  created_at: u.isString,
  updated_at: u.isString,
  web_url: u.isString,
  _links: u.isObjectOf({
    self: u.isString,
    notes: u.isString,
    award_emoji: u.isString,
    project: u.isString,
    ...u.isUnknown,
  }),
  ...u.isUnknown,
});

export type Issue = u.PredicateType<typeof isIssue>;
