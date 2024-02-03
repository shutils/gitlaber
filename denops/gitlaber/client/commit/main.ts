import { unknownutil as u } from "../../deps.ts";

import { request } from "../core.ts";
import { isCommit } from "./types.ts";
import { ProjectId } from "../../types.ts";

export async function getProjectCommit(
  url: string,
  token: string,
  attrs: { id: ProjectId; sha: string; stats?: boolean },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/commits/${attrs.sha}`;
  return u.ensure(await request(gitlabApiPath, token, "GET"), isCommit);
}
