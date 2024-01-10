import { parse } from "https://deno.land/std@0.210.0/path/mod.ts";
import { GITLAB_DEFAULT_URL } from "../constant.ts";

type Method = "GET" | "POST" | "PUT" | "DELETE";

function isHttpPath(path: string) {
  return path.startsWith("http");
}

function isSshPath(path: string) {
  return path.startsWith("ssh");
}

function exec(cmd: string, args: string[], cwd?: string) {
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
}

export function getUrlEncodedPath(path: string) {
  if (isHttpPath(path) || isSshPath(path)) {
    const splitedPath = path.split("/");
    const namespace = splitedPath[splitedPath.length - 2];
    const projectPathWithExt = splitedPath[splitedPath.length - 1];
    const projectPath = parse(projectPathWithExt).name;
    return namespace + "%2F" + projectPath;
  } else {
    throw new Error("Failed to encode repository URL.");
  }
}

export function getRemoteUrl(cwd?: string) {
  return exec("git", ["remote", "get-url", "origin"], cwd);
}

export function getGitlabUrl(cwd?: string) {
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
}

export function getGitlabToken(cwd?: string) {
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
}

export function createHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    "PRIVATE-TOKEN": token,
  };
}

export async function request(
  url: string,
  token: string,
  method?: Method,
  body?: string,
) {
  return await fetch(url, {
    method: method,
    headers: createHeaders(token),
    body: body,
  });
}
