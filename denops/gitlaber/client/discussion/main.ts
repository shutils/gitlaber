import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isDiscussion } from "./types.ts";

export async function getProjectMrDiscussion(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    mr_iid: number;
  },
) {
  const baseApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.mr_iid}/discussions`;
  return u.ensure(
    await request(baseApiPath, token, "GET"),
    u.isArrayOf(isDiscussion),
  );
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
