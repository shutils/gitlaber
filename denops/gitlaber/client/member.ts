import { unknownutil as u } from "../deps.ts";
import { request } from "./util.ts";

export const isMember = u.isObjectOf({
  id: u.isNumber,
  username: u.isString,
  name: u.isString,
  ...u.isUnknown,
});

export type Member = u.PredicateType<typeof isMember>;

const isProjectMemberGetAttributes = u.isObjectOf({
  id: u.isNumber,
  query: u.isOptionalOf(u.isString),
  user_ids: u.isOptionalOf(u.isArrayOf(u.isNumber)),
  skip_users: u.isOptionalOf(u.isArrayOf(u.isNumber)),
  show_seat_info: u.isOptionalOf(u.isBoolean),
});

export type ProjectMemberGetAttributes = u.PredicateType<
  typeof isProjectMemberGetAttributes
>;

export async function requestGetProjectMembers(
  url: string,
  token: string,
  attrs: ProjectMemberGetAttributes,
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/members`;
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
