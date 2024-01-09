import { parse } from "https://deno.land/std@0.210.0/path/mod.ts";
import { GITLAB_DEFAULT_URL } from "../constant.ts";

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

export const getUrlEncodedPath = (path: string) => {
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

export const getRemoteUrl = (cwd?: string) => {
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

export const createHeaders = (token: string) => {
  return {
    "Content-Type": "application/json",
    "PRIVATE-TOKEN": token,
  };
};
