import { unknownutil as u } from "../deps.ts";
import { createHeaders } from "./util.ts";

export const isCommit = u.isObjectOf({
  id: u.isString,
  short_id: u.isString,
  title: u.isString,
  author_name: u.isString,
  author_email: u.isString,
  committer_name: u.isString,
  committer_email: u.isString,
  created_at: u.isString,
  message: u.isString,
  committed_date: u.isString,
  parent_ids: u.isArrayOf(u.isString),
  ...u.isUnknown,
});

export type Commit = u.PredicateType<typeof isCommit>;

const isCommitGetAttributes = u.isObjectOf({
  id: u.isNumber,
  sha: u.isString,
  stats: u.isOptionalOf(u.isBoolean),
  ...u.isUnknown,
});

export type CommitGetAttributes = u.PredicateType<
  typeof isCommitGetAttributes
>;

export async function requestGetCommit(
  url: string,
  token: string,
  attrs: CommitGetAttributes,
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/commits/${attrs.sha}`;
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: createHeaders(token),
  });
  if (!(res.status == 200)) {
    throw new Error("Failed to get a commit.");
  }
  const commit = await res.json();
  if (!isCommit(commit)) {
    throw new Error(`This is not a commit. ${commit}`);
  }
  return commit;
}
