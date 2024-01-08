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

const getGitlabUrl = (cwd?: string) => {
  try {
    return exec("git", ["config", "--get", "gitlab.url"], cwd);
  } catch {
    const gitlabUrl = Deno.env.get("GITLAB_URL");
    if (gitlabUrl) {
      return gitlabUrl;
    } else {
      return GITLAB_DEFAULT_URL;
    }
  }
};

const getGitlabToken = (cwd?: string) => {
  try {
    return exec("git", ["config", "--get", "gitlab.token"], cwd);
  } catch {
    const gitlabToken = Deno.env.get("GITLAB_TOKEN");
    if (gitlabToken) {
      return gitlabToken;
    } else {
      throw new Error("Unable to get GitLab token");
    }
  }
};

const getHeaders = () => {
  return {
    "Content-Type": "application/json",
    "PRIVATE-TOKEN": getGitlabToken(),
  };
};

export const getSingleProject = async (cwd?: string): Promise<
  Project
> => {
  const gitlabUrl = getGitlabUrl(cwd);
  const projectPath = getUrlEncodedPath(getRemoteUrl(cwd));
  const gitlabApiPath = gitlabUrl + "/api/v4/projects/" + projectPath;
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: getHeaders(),
  });
  const project = await res.json();
  if (!isProject(project)) {
    throw new Error("Failed to get project.");
  }
  return project;
};

export const getProjectIssues = async (
  projectId: number,
): Promise<Issue[]> => {
  const gitlabUrl = getGitlabUrl();
  const gitlabApiPath = gitlabUrl + "/api/v4/projects/" + projectId + "/issues";
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: getHeaders(),
  });
  const issues = await res.json();
  if (!u.isArrayOf(isIssue)(issues)) {
    throw new Error("Failed to get issues.");
  }
  return issues;
};

export const getProjectId = async (cwd?: string) => {
  const singleProject = await getSingleProject(cwd);
  const id = singleProject.id;
  return await Promise.resolve(id);
};

export const requestCreateNewProjectIssue = async (
  projectId: number,
  attributes: IssueCreateNewAttributes,
): Promise<void> => {
  const gitlabUrl = getGitlabUrl();
  const gitlabApiPath = gitlabUrl + "/api/v4/projects/" + projectId + "/issues";
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(attributes),
  });
  if (res.status != 201) {
    throw new Error("Failed to create new issue.");
  }
};

export const requestDeleteIssue = async (
  projectId: number,
  issue_iid: number,
): Promise<void> => {
  const gitlabUrl = getGitlabUrl();
  const gitlabApiPath =
    `${gitlabUrl}/api/v4/projects/${projectId}/issues/${issue_iid}`;
  const res = await fetch(gitlabApiPath, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (res.status != 204) {
    throw new Error("Failed to delete issue.");
  }
};

export const requestEditIssue = async (
  attributes: IssueEditAttributes,
): Promise<void> => {
  const gitlabUrl = getGitlabUrl();
  const projectId = attributes.id;
  const issue_iid = attributes.issue_iid;
  const gitlabApiPath =
    `${gitlabUrl}/api/v4/projects/${projectId}/issues/${issue_iid}`;
  const res = await fetch(gitlabApiPath, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(attributes),
  });
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit issue.");
  }
};

export const requestCreateNewProjectWiki = async (
  attributes: WikiCreateAttributes,
): Promise<void> => {
  const gitlabUrl = getGitlabUrl();
  const projectId = attributes.id;
  const gitlabApiPath = `${gitlabUrl}/api/v4/projects/${projectId}/wikis`;
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(attributes),
  });
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new wiki.");
  }
};

export const getProjectWikis = async (
  attributes: WikisGetAttributes,
): Promise<Wiki[]> => {
  const gitlabUrl = getGitlabUrl();
  const projectId = attributes.id;
  const gitlabApiPath =
    `${gitlabUrl}/api/v4/projects/${projectId}/wikis?with_content=1`;
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: getHeaders(),
  });
  return res.json();
};

export const requestEditWiki = async (
  attributes: WikiEditAttributes,
): Promise<void> => {
  const gitlabUrl = getGitlabUrl();
  const projectId = attributes.id;
  const slug = attributes.slug;
  const gitlabApiPath =
    `${gitlabUrl}/api/v4/projects/${projectId}/wikis/${slug}`;
  const res = await fetch(gitlabApiPath, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(attributes),
  });
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit wiki.");
  }
};

export const requestDeleteWiki = async (
  attributes: WikiDeleteAttributes,
): Promise<void> => {
  const gitlabUrl = getGitlabUrl();
  const projectId = attributes.id;
  const slug = attributes.slug;
  const gitlabApiPath =
    `${gitlabUrl}/api/v4/projects/${projectId}/wikis/${slug}`;
  const res = await fetch(gitlabApiPath, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (res.status != 204) {
    throw new Error("Failed to delete a wiki.");
  }
};
