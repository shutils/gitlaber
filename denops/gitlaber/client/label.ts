import { unknownutil as u } from "../deps.ts";
import { request } from "./util.ts";

export const isProjectLabel = u.isObjectOf({
  id: u.isNumber,
  name: u.isString,
  ...u.isUnknown,
});

export type ProjectLabel = u.PredicateType<typeof isProjectLabel>;

const isProjectLabelsGetAttributes = u.isObjectOf({
  id: u.isNumber,
  with_counts: u.isOptionalOf(u.isBoolean),
  include_ancestor_groups: u.isOptionalOf(u.isBoolean),
  search: u.isOptionalOf(u.isString),
});

export type ProjectLabelsGetAttributes = u.PredicateType<
  typeof isProjectLabelsGetAttributes
>;

export async function requestGetProjectLabels(
  url: string,
  token: string,
  attrs: ProjectLabelsGetAttributes,
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/labels`;
  const res = await request(gitlabApiPath, token, "GET");
  if (!(res.status == 200)) {
    throw new Error("Failed to get project labels.");
  }
  const labels = await res.json();
  if (!u.isArrayOf(isProjectLabel)(labels)) {
    throw new Error(`Failed to get project labels.`);
  }
  return labels;
}