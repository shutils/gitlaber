import { unknownutil as u } from "../deps.ts";
import { request } from "./core.ts";
import { Branch, isBranch } from "./types.ts";

export async function getProjectBranch(
  url: string,
  token: string,
  attrs: {
    id: number;
    branch: string;
  },
): Promise<Branch> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches/${attrs.branch}`;
  const res = await request(gitlabApiPath, token, "GET");
  const branch = await res.json();
  if (!isBranch(branch)) {
    throw new Error("Failed to get branch.");
  }
  return branch;
}

export async function getProjectBranches(
  url: string,
  token: string,
  attrs: {
    id: number;
    search?: string;
    regex?: string;
  },
): Promise<Branch[]> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  const res = await request(gitlabApiPath, token, "GET");
  const branches = await res.json();
  if (!u.isArrayOf(isBranch)(branches)) {
    throw new Error("Failed to get branches.");
  }
  return branches;
}

export async function createProjectBranch(
  url: string,
  token: string,
  attrs: {
    id: number;
    ref: string;
    branch: string;
  },
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/repository/branches`;
  const res = await request(
    gitlabApiPath,
    token,
    "POST",
    JSON.stringify(attrs),
  );
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new branch.");
  }
}
