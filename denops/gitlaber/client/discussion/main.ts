import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isDiscussion } from "./types.ts";

export async function getProjectMrDiscussion(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    merge_request_iid: number;
    discussion_id: string;
  },
) {
  const baseApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/discussions/${attrs.discussion_id}`;
  return u.ensure(
    await request(baseApiPath, token, "GET"),
    isDiscussion,
  );
}

export async function getProjectMrDiscussions(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    merge_request_iid: number;
  },
) {
  const baseApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/discussions?per_page=100`;
  return u.ensure(
    await request(baseApiPath, token, "GET"),
    u.isArrayOf(isDiscussion),
  );
}

export async function createProjectMrOverviewDiscussion(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    merge_request_iid: number;
    body: string;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/discussions`;
  await request(gitlabApiPath, token, "POST", JSON.stringify(attrs));
}

export async function createProjectMrDiscussion(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    merge_request_iid: number;
    body: string;
    position: {
      base_sha: string;
      head_sha: string;
      start_sha: string;
      new_path: string;
      old_path: string;
      position_type: "text" | "image";
      new_line?: number;
      old_line?: number;
    };
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/discussions`;
  const attributes = {
    id: attrs.id,
    merge_request_iid: attrs.merge_request_iid,
    body: attrs.body,
    position: attrs.position,
  };
  await request(gitlabApiPath, token, "POST", JSON.stringify(attributes));
}

export async function addNoteToDiscussion(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    merge_request_iid: number;
    discussion_id: string;
    body: string;
    note_id: number;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/discussions/${attrs.discussion_id}/notes`;
  await request(gitlabApiPath, token, "POST", JSON.stringify(attrs));
}

export async function resolveProjectMrDiscussion(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    merge_request_iid: number;
    discussion_id: string;
  },
) {
  const exAttrs = {
    ...attrs,
    resolved: true,
  };
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/discussions/${attrs.discussion_id}`;
  await request(gitlabApiPath, token, "PUT", JSON.stringify(exAttrs));
}
