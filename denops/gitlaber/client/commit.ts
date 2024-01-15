import { unknownutil as u } from "../deps.ts";
import { request } from "./util.ts";

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

export async function requestGetCommit(
  url: string,
  token: string,
  attrs: {
    id: number;
    sha: string;
    stats?: boolean;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/commits/${attrs.sha}`;
  const res = await request(gitlabApiPath, token, "GET");
  if (!(res.status == 200)) {
    throw new Error("Failed to get a commit.");
  }
  const commit = await res.json();
  if (!isCommit(commit)) {
    throw new Error(`This is not a commit. ${commit}`);
  }
  return commit;
}
