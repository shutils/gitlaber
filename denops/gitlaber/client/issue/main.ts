import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isIssue, IssueGetAttributes } from "./types.ts";
import { objectToURLSearchParams } from "../helper.ts";

export async function getProjectIssues(
  url: string,
  token: string,
  attrs: { id: number | string } & IssueGetAttributes,
) {
  const baseApiPath = `${url}/api/v4/projects/${attrs.id}/issues`;

  const queryPrams = objectToURLSearchParams(attrs);
  const gitlabApiPath = baseApiPath + "?" + queryPrams;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isIssue),
  );
}

export async function createProjectIssue(
  url: string,
  token: string,
  attributes: { id: number; iid?: number; title: string; description?: string },
) {
  const gitlabApiPath = url + "/api/v4/projects/" + attributes.id + "/issues";
  await request(gitlabApiPath, token, "POST", JSON.stringify(attributes));
}

export async function deleteProjectIssue(
  url: string,
  token: string,
  attrs: { id: number; issue_iid: number },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/issues/${attrs.issue_iid}`;
  await request(gitlabApiPath, token, "DELETE");
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
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/issues/${attrs.issue_iid}`;
  await request(gitlabApiPath, token, "PUT", JSON.stringify(attrs));
}
