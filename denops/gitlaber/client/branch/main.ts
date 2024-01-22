import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isBranch } from "./types.ts";

export async function getProjectBranch(
  url: string,
  token: string,
  attrs: { id: number; branch: string },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches/${attrs.branch}`;
  return u.ensure(await request(gitlabApiPath, token, "GET"), isBranch);
}

export async function getProjectBranches(
  url: string,
  token: string,
  attrs: { id: number; search?: string; regex?: string },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isBranch),
  );
}

export async function createProjectBranch(
  url: string,
  token: string,
  attrs: { id: number; ref: string; branch: string },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  await request(gitlabApiPath, token, "POST", JSON.stringify(attrs));
}
