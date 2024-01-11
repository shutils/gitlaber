import { unknownutil as u } from "../deps.ts";
import { request } from "./util.ts";

const isMergeRequestCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  source_branch: u.isString,
  target_branch: u.isString,
  title: u.isString,
  description: u.isOptionalOf(u.isString),
  assignee_id: u.isOptionalOf(u.isNumber),
  remove_source_branch: u.isOptionalOf(u.isBoolean),
  squash: u.isOptionalOf(u.isBoolean),
  ...u.isUnknown,
});

export type MergeRequestCreateAttributes = u.PredicateType<
  typeof isMergeRequestCreateAttributes
>;

const isMergeRequestGetAttributes = u.isObjectOf({
  id: u.isNumber,
  approved: u.isOptionalOf(u.isLiteralOneOf(["yes", "no"] as const)),
  assignee_id: u.isOptionalOf(u.isNumber),
  author_id: u.isOptionalOf(u.isNumber),
  author_username: u.isOptionalOf(u.isString),
  labels: u.isOptionalOf(u.isString),
  ...u.isUnknown,
});

export type MergeRequestGetAttributes = u.PredicateType<
  typeof isMergeRequestGetAttributes
>;

const isMergeRequestEditAttributes = u.isObjectOf({
  id: u.isNumber,
  merge_request_iid: u.isNumber,
  add_labels: u.isOptionalOf(u.isString),
  assignee_id: u.isOptionalOf(u.isNumber),
  assignee_ids: u.isOptionalOf(u.isArrayOf(u.isNumber)),
  description: u.isOptionalOf(u.isString),
  labels: u.isOptionalOf(u.isString),
  remove_labels: u.isOptionalOf(u.isString),
  remove_source_branch: u.isOptionalOf(u.isBoolean),
  reviewer_ids: u.isOptionalOf(u.isArrayOf(u.isNumber)),
  squash: u.isOptionalOf(u.isBoolean),
  state_event: u.isOptionalOf(u.isLiteralOneOf(["close", "reopen"] as const)),
  target_branch: u.isOptionalOf(u.isString),
  title: u.isOptionalOf(u.isString),
  ...u.isUnknown,
});

export type MergeRequestEditAttributes = u.PredicateType<
  typeof isMergeRequestEditAttributes
>;

export const isMergeRequest = u.isObjectOf({
  id: u.isNumber,
  iid: u.isNumber,
  title: u.isString,
  description: u.isOneOf([u.isString, u.isNull]),
  target_branch: u.isString,
  source_branch: u.isString,
  draft: u.isBoolean,
  web_url: u.isString,
  squash: u.isBoolean,
  ...u.isUnknown,
});

export type MergeRequest = u.PredicateType<typeof isMergeRequest>;

export async function requestCreateMergeRequest(
  url: string,
  token: string,
  attrs: MergeRequestCreateAttributes,
): Promise<void> {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/merge_requests`;
  const res = await request(
    gitlabApiPath,
    token,
    "POST",
    JSON.stringify(attrs),
  );
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new merge request.");
  }
}

export async function getProjectMergeRequests(
  url: string,
  token: string,
  attrs: MergeRequestGetAttributes,
): Promise<MergeRequest[]> {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/merge_requests`;
  const res = await request(gitlabApiPath, token, "GET");
  const mrs = await res.json();
  if (!u.isArrayOf(isMergeRequest)(mrs)) {
    throw new Error(`Failed to get merge requests. reason: ${mrs}`);
  }
  return mrs;
}

export async function requestEditMergeRequest(
  url: string,
  token: string,
  attrs: MergeRequestEditAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}`;
  const res = await request(
    gitlabApiPath,
    token,
    "PUT",
    JSON.stringify(attrs),
  );
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit a merge request.");
  }
}
