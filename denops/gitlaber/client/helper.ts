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
    const namespace = splitedPath[splitedPath.length - 2];
    const projectPathWithExt = splitedPath[splitedPath.length - 1];
    const projectPath = parse(projectPathWithExt).name;
    return namespace + "%2F" + projectPath;
  } else {
    throw new Error("Failed to encode repository URL.");
  }
}
