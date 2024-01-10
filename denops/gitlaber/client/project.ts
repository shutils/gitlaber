import { unknownutil as u } from "../deps.ts";
import { getRemoteUrl, getUrlEncodedPath, request } from "./util.ts";

export const isProject = u.isObjectOf({
  id: u.isNumber,
  description: u.isOneOf([u.isString, u.isNull]),
  web_url: u.isString,
  name: u.isString,
  open_issues_count: u.isNumber,
  created_at: u.isString,
  updated_at: u.isOptionalOf(u.isString),
  default_branch: u.isString,
  issue_branch_template: u.isOneOf([u.isString, u.isNull]),
  _links: u.isObjectOf({
    self: u.isString,
    issues: u.isString,
    merge_requests: u.isString,
    repo_branches: u.isString,
    labels: u.isString,
    events: u.isString,
    members: u.isString,
    cluster_agents: u.isString,
    ...u.isUnknown,
  }),
  ...u.isUnknown,
});

export type Project = u.PredicateType<typeof isProject>;

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
