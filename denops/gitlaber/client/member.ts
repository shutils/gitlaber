import { unknownutil as u } from "../deps.ts";
import { request } from "./core.ts";
import { isMember } from "./types.ts";

export async function getProjectMembers(
  url: string,
  token: string,
  attrs: {
    id: number;
    query?: string;
    user_ids?: number[];
    skip_users?: number[];
    show_seat_info?: boolean;
  },
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/members/all`;
  const res = await request(gitlabApiPath, token, "GET");
  if (!(res.status == 200)) {
    throw new Error("Failed to get project members.");
  }
  const members = await res.json();
  if (!u.isArrayOf(isMember)(members)) {
    throw new Error(`Failed to get project members.`);
  }
  return members;
}
