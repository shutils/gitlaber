import { unknownutil as u } from "../deps.ts";
import { request } from "./core.ts";
import { isIssue, Issue, IssueGetAttributes } from "./types.ts";
import { objectToURLSearchParams } from "./helper.ts";

export async function getProjectIssues(
  url: string,
  token: string,
  attrs: {
    id: number | string;
  } & IssueGetAttributes,
): Promise<Issue[]> {
  const baseApiPath = `${url}/api/v4/projects/${attrs.id}/issues`;

  const queryPrams = objectToURLSearchParams(attrs);
  const gitlabApiPath = baseApiPath + "?" + queryPrams;
  const res = await request(gitlabApiPath, token, "GET");
  const issues = await res.json();
  if (!u.isArrayOf(isIssue)(issues)) {
    throw new Error("Failed to get issues.");
  }
  return issues;
}

export async function createProjectIssue(
  url: string,
  token: string,
  attributes: {
    id: number;
    iid?: number;
    title: string;
    description?: string;
  },
): Promise<void> {
  const gitlabApiPath = url + "/api/v4/projects/" + attributes.id + "/issues";
  const res = await request(
    gitlabApiPath,
    token,
    "POST",
    JSON.stringify(attributes),
  );
  if (res.status != 201) {
    throw new Error("Failed to create new issue.");
  }
}

export async function deleteProjectIssue(
  url: string,
  token: string,
  attrs: {
    id: number;
    issue_iid: number;
  },
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/issues/${attrs.issue_iid}`;
  const res = await request(gitlabApiPath, token, "DELETE");
  if (res.status != 204) {
    throw new Error("Failed to delete issue.");
  }
}

export async function editProjectIssue(
  url: string,
  token: string,
  attrs: {
    id: number;
    issue_iid: number;
    add_labels?: string;
    assignee_ids?: number[];
    confidential?: boolean;
    description?: string;
    discussion_locked?: boolean;
    due_date?: string;
    epic_id?: number;
    epic_iid?: number;
    issue_type?: "issue" | "incident" | "test_case" | "task";
    labels?: string;
    milestone_id?: number;
    remove_labels?: string;
    state_event?: "close" | "reopen";
    title?: string;
    updated_at?: string;
    weight?: number;
  },
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/issues/${attrs.issue_iid}`;
  const res = await request(gitlabApiPath, token, "PUT", JSON.stringify(attrs));
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit issue.");
  }
}
