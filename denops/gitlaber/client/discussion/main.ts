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
