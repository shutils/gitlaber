import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { ProjectId } from "../../types.ts";
import { isPipeline } from "./types.ts";

export async function getProjectPipelines(
  url: string,
  token: string,
  attrs: {
    id: ProjectId;
  },
) {
  const gitlabApiPath = url + "/api/v4/projects/" + attrs.id + "/pipelines";
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isPipeline),
  );
}
