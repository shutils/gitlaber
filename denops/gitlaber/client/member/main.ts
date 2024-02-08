import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isMember } from "./types.ts";
import { ProjectId } from "../../types.ts";

export async function getProjectMembers(
  url: string,
  token: string,
  attrs: {
    id: ProjectId;
    query?: string;
    user_ids?: number[];
    skip_users?: number[];
    show_seat_info?: boolean;
  },
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/members/all`;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isMember),
  );
}
