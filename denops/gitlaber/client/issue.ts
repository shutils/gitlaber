import { unknownutil as u } from "../deps.ts";
import { createHeaders } from "./util.ts";

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

const isIssueCreateNewAttributes = u.isObjectOf({
  id: u.isNumber,
  title: u.isOptionalOf(u.isString),
  description: u.isOptionalOf(u.isString),
  iid: u.isOptionalOf(u.isNumber),
});

export type IssueCreateNewAttributes = u.PredicateType<
  typeof isIssueCreateNewAttributes
>;

const isIssueCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  issue_iid: u.isNumber,
  add_labels: u.isOptionalOf(u.isString),
  confidential: u.isOptionalOf(u.isBoolean),
  description: u.isOptionalOf(u.isString),
  discussion_locked: u.isOptionalOf(u.isBoolean),
  due_date: u.isOptionalOf(u.isString),
  epic_id: u.isOptionalOf(u.isNumber),
  epic_iid: u.isOptionalOf(u.isNumber),
  issue_type: u.isOptionalOf(
    u.isLiteralOneOf(["issue", "incident", "test_case", "task"] as const),
  ),
  labels: u.isOptionalOf(u.isString),
  milestone_id: u.isOptionalOf(u.isNumber),
  remove_labels: u.isOptionalOf(u.isString),
  state_event: u.isOptionalOf(u.isLiteralOneOf(["close", "reopen"] as const)),
  title: u.isOptionalOf(u.isString),
  updated_at: u.isOptionalOf(u.isString),
  weight: u.isOptionalOf(u.isNumber),
});

export type IssueEditAttributes = u.PredicateType<
  typeof isIssueCreateAttributes
>;

export async function getProjectIssues(
  url: string,
  token: string,
  projectId: number,
): Promise<Issue[]> {
  const gitlabApiPath = url + "/api/v4/projects/" + projectId +
    "/issues?state=opened";
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: createHeaders(token),
  });
  const issues = await res.json();
  if (!u.isArrayOf(isIssue)(issues)) {
    throw new Error("Failed to get issues.");
  }
  return issues;
}

export async function requestCreateNewProjectIssue(
  url: string,
  token: string,
  projectId: number,
  attributes: IssueCreateNewAttributes,
): Promise<void> {
  const gitlabApiPath = url + "/api/v4/projects/" + projectId + "/issues";
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(attributes),
  });
  if (res.status != 201) {
    throw new Error("Failed to create new issue.");
  }
}

export async function requestDeleteIssue(
  url: string,
  token: string,
  projectId: number,
  issue_iid: number,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${projectId}/issues/${issue_iid}`;
  const res = await fetch(gitlabApiPath, {
    method: "DELETE",
    headers: createHeaders(token),
  });
  if (res.status != 204) {
    throw new Error("Failed to delete issue.");
  }
}

export async function requestEditIssue(
  url: string,
  token: string,
  attrs: IssueEditAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/issues/${attrs.issue_iid}`;
  const res = await fetch(gitlabApiPath, {
    method: "PUT",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit issue.");
  }
}
