import { parse } from "https://deno.land/std@0.210.0/path/mod.ts";
import { exec } from "../helper.ts";

function isHttpPath(path: string) {
  return path.startsWith("http");
}

function isSshPath(path: string) {
  return path.startsWith("ssh");
}

export function getRemoteUrl(cwd?: string) {
  return exec("git", ["remote", "get-url", "origin"], cwd);
}

export function getUrlEncodedPath(path: string) {
  if (isHttpPath(path) || isSshPath(path)) {
    const splitedPath = path.split("/");
    const namespace = splitedPath.slice(3, splitedPath.length - 1).join("%2F");
    const projectPathWithExt = splitedPath[splitedPath.length - 1];
    const projectPath = parse(projectPathWithExt).name;
    return namespace + "%2F" + projectPath;
  } else {
    throw new Error("Failed to encode repository URL.");
  }
}

export function objectToURLSearchParams(params: { [key: string]: unknown }) {
  // NOTE: If the object property is an array, convert the array elements as bar[]=1&bar[]=2
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((v) => {
        searchParams.append(`${key}[]`, v.toString());
      });
    } else if (typeof value === "number") {
      searchParams.append(key, value.toString());
    } else if (typeof value === "string") {
      searchParams.append(key, value);
    }
  });
  return searchParams;
}
