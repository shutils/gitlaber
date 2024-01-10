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
