import { request } from "./core.ts";
import { getRemoteUrl, getUrlEncodedPath } from "./helper.ts";
import { isProject, Project } from "./types.ts";

export async function getSingleProject(
  url: string,
  token: string,
  cwd?: string,
): Promise<
  Project
> {
  const projectPath = getUrlEncodedPath(getRemoteUrl(cwd));
  const gitlabApiPath = url + "/api/v4/projects/" + projectPath;
  const res = await request(gitlabApiPath, token, "GET");
  const project = await res.json();
  if (!isProject(project)) {
    throw new Error("Failed to get project.");
  }
  return project;
}
