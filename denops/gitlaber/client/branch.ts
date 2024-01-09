import { unknownutil as u } from "../deps.ts";
import { createHeaders } from "./util.ts";

export const isBranch = u.isObjectOf({
  name: u.isString,
  merged: u.isBoolean,
  protected: u.isBoolean,
  default: u.isBoolean,
  developers_can_push: u.isBoolean,
  developers_can_merge: u.isBoolean,
  can_push: u.isBoolean,
  web_url: u.isString,
  commit: u.isObjectOf({
    id: u.isString,
    short_id: u.isString,
    created_at: u.isString,
    parent_ids: u.isArrayOf(u.isString),
    title: u.isString,
    message: u.isString,
    author_name: u.isString,
    author_email: u.isString,
    authored_date: u.isString,
    committer_name: u.isString,
    committer_email: u.isString,
    committed_date: u.isString,
    web_url: u.isString,
    ...u.isUnknown,
  }),
  ...u.isUnknown,
});

export type Branch = u.PredicateType<typeof isBranch>;

const isBranchCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  branch: u.isString,
  ref: u.isString,
});

export type BranchCreateAttributes = u.PredicateType<
  typeof isBranchCreateAttributes
>;

const isBranchGetAttributes = u.isObjectOf({
  id: u.isNumber,
  search: u.isOptionalOf(u.isString),
  regex: u.isOptionalOf(u.isString),
});

export type BranchGetAttributes = u.PredicateType<
  typeof isBranchGetAttributes
>;

export async function getProjectBranches(
  url: string,
  token: string,
  attrs: BranchGetAttributes,
): Promise<Branch[]> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: createHeaders(token),
  });
  const branches = await res.json();
  if (!u.isArrayOf(isBranch)(branches)) {
    throw new Error("Failed to get branches.");
  }
  return branches;
}

export async function requestCreateIssueBranch(
  url: string,
  token: string,
  attrs: BranchCreateAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new branch.");
  }
}
