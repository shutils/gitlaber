import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isProjectLabel } from "./types.ts";

export async function getProjectLabels(
  url: string,
  token: string,
  attrs: {
    id: number;
    search?: string;
    include_ancestor_groups?: boolean;
    with_counts?: boolean;
  },
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/labels`;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isProjectLabel),
  );
}
