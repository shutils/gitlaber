import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isBranch } from "./types.ts";
import { objectToURLSearchParams } from "../helper.ts";
import { PaginationAttributes, ProjectId } from "../types.ts";

export async function getProjectBranch(
  url: string,
  token: string,
  attrs: { id: ProjectId; branch: string },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches/${attrs.branch}`;
  return u.ensure(await request(gitlabApiPath, token, "GET"), isBranch);
}

export async function getProjectBranches(
  url: string,
  token: string,
  attrs: { id: ProjectId; search?: string; regex?: string } & PaginationAttributes,
) {
  const baseApiPath = `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  const queryPrams = objectToURLSearchParams(attrs);
  const gitlabApiPath = baseApiPath + "?" + queryPrams;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isBranch),
  );
}

export async function createProjectBranch(
  url: string,
  token: string,
  attrs: { id: ProjectId; ref: string; branch: string },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  await request(gitlabApiPath, token, "POST", JSON.stringify(attrs));
}
