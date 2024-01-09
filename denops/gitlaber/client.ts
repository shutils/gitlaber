import { parse } from "https://deno.land/std@0.210.0/path/mod.ts";
import { unknownutil as u } from "./deps.ts";

import {
  isIssue,
  isProject,
  Issue,
  IssueCreateNewAttributes,
  IssueEditAttributes,
  Project,
  Wiki,
  WikiCreateAttributes,
  WikiDeleteAttributes,
  WikiEditAttributes,
  WikisGetAttributes,
  BranchCreateAttributes,
} from "./types.ts";
import { GITLAB_DEFAULT_URL } from "./constant.ts";

const isHttpPath = (path: string) => {
  return path.startsWith("http");
};

const isSshPath = (path: string) => {
  return path.startsWith("ssh");
};

const exec = (cmd: string, args: string[], cwd?: string) => {
  const result = new Deno.Command(cmd, {
    args: args,
    cwd: cwd,
  });
  const { success, stdout, stderr } = result.outputSync();
  if (success === true) {
    const std = new TextDecoder().decode(stdout).replace(/\n/g, "");
    return std;
  } else {
    throw new Error(
      `An error occurred while executing the command (${cmd}). reason: ${
        new TextDecoder().decode(stderr)
      }`,
    );
  }
};

const getUrlEncodedPath = (path: string) => {
  if (isHttpPath(path) || isSshPath(path)) {
    const splitedPath = path.split("/");
    const namespace = splitedPath[splitedPath.length - 2];
    const projectPathWithExt = splitedPath[splitedPath.length - 1];
    const projectPath = parse(projectPathWithExt).name;
    return namespace + "%2F" + projectPath;
  } else {
    throw new Error("Failed to encode repository URL.");
  }
};

const getRemoteUrl = (cwd?: string) => {
  return exec("git", ["remote", "get-url", "origin"], cwd);
};

export const getGitlabUrl = (cwd?: string) => {
  try {
    return exec("git", ["config", "--get", "gitlab.url"], cwd);
  } catch {
    const url = Deno.env.get("GITLAB_URL");
    if (url) {
      return url;
    } else {
      return GITLAB_DEFAULT_URL;
    }
  }
};

export const getGitlabToken = (cwd?: string) => {
  try {
    return exec("git", ["config", "--get", "gitlab.token"], cwd);
  } catch {
    const token = Deno.env.get("GITLAB_TOKEN");
    if (token) {
      return token;
    } else {
      throw new Error("Unable to get GitLab token");
    }
  }
};

const createHeaders = (token: string) => {
  return {
    "Content-Type": "application/json",
    "PRIVATE-TOKEN": token,
  };
};

export const getSingleProject = async (
  url: string,
  token: string,
  cwd?: string,
): Promise<
  Project
> => {
  const projectPath = getUrlEncodedPath(getRemoteUrl(cwd));
  const gitlabApiPath = url + "/api/v4/projects/" + projectPath;
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: createHeaders(token),
  });
  const project = await res.json();
  if (!isProject(project)) {
    throw new Error("Failed to get project.");
  }
  return project;
};

export const getProjectIssues = async (
  url: string,
  token: string,
  projectId: number,
): Promise<Issue[]> => {
  const gitlabApiPath = url + "/api/v4/projects/" + projectId + "/issues?state=opened";
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: createHeaders(token),
  });
  const issues = await res.json();
  if (!u.isArrayOf(isIssue)(issues)) {
    throw new Error("Failed to get issues.");
  }
  return issues;
};

export const requestCreateNewProjectIssue = async (
  url: string,
  token: string,
  projectId: number,
  attributes: IssueCreateNewAttributes,
): Promise<void> => {
  const gitlabApiPath = url + "/api/v4/projects/" + projectId + "/issues";
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(attributes),
  });
  if (res.status != 201) {
    throw new Error("Failed to create new issue.");
  }
};

export const requestDeleteIssue = async (
  url: string,
  token: string,
  projectId: number,
  issue_iid: number,
): Promise<void> => {
  const gitlabApiPath =
    `${url}/api/v4/projects/${projectId}/issues/${issue_iid}`;
  const res = await fetch(gitlabApiPath, {
    method: "DELETE",
    headers: createHeaders(token),
  });
  if (res.status != 204) {
    throw new Error("Failed to delete issue.");
  }
};

export const requestEditIssue = async (
  url: string,
  token: string,
  attrs: IssueEditAttributes,
): Promise<void> => {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/issues/${attrs.issue_iid}`;
  const res = await fetch(gitlabApiPath, {
    method: "PUT",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit issue.");
  }
};

export const requestCreateNewProjectWiki = async (
  url: string,
  token: string,
  attrs: WikiCreateAttributes,
): Promise<void> => {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/wikis`;
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new wiki.");
  }
};

export const getProjectWikis = async (
  url: string,
  token: string,
  attrs: WikisGetAttributes,
): Promise<Wiki[]> => {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis?with_content=1`;
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: createHeaders(token),
  });
  return res.json();
};

export const requestEditWiki = async (
  url: string,
  token: string,
  attrs: WikiEditAttributes,
): Promise<void> => {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  const res = await fetch(gitlabApiPath, {
    method: "PUT",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit wiki.");
  }
};

export const requestDeleteWiki = async (
  url: string,
  token: string,
  attrs: WikiDeleteAttributes,
): Promise<void> => {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  const res = await fetch(gitlabApiPath, {
    method: "DELETE",
    headers: createHeaders(token),
  });
  if (res.status != 204) {
    throw new Error("Failed to delete a wiki.");
  }
};

export const requestCreateIssueBranch = async (
  url: string,
  token: string,
  attrs: BranchCreateAttributes,
): Promise<void> => {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new branch.");
  }
};
