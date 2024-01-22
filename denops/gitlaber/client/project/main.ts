import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { getRemoteUrl, getUrlEncodedPath } from "../helper.ts";
import { isProject } from "./types.ts";

export async function getProject(
  url: string,
  token: string,
  cwd?: string,
) {
  const projectPath = getUrlEncodedPath(getRemoteUrl(cwd));
  const gitlabApiPath = url + "/api/v4/projects/" + projectPath;
  return u.ensure(await request(gitlabApiPath, token, "GET"), isProject);
}
