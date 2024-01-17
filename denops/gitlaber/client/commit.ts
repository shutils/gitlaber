import { request } from "./core.ts";
import { isCommit } from "./types.ts";

export async function getProjectCommit(
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
