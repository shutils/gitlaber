import { unknownutil as u } from "../../deps.ts";
import { request, requestRaw } from "../core.ts";
import { isJob } from "./types.ts";
import { objectToURLSearchParams } from "../helper.ts";
import { PaginationAttributes, ProjectId } from "../types.ts";

export async function getProjectJobs(
  url: string,
  token: string,
  attrs: { id: ProjectId } & PaginationAttributes,
) {
  const baseApiPath = `${url}/api/v4/projects/${attrs.id}/jobs`;

  const queryPrams = objectToURLSearchParams(attrs);
  const gitlabApiPath = baseApiPath + "?" + queryPrams;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isJob),
  );
}

export async function getProjectJobLog(
  url: string,
  token: string,
  attrs: { id: ProjectId; job_id: number },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/jobs/${attrs.job_id}/trace`;
  return u.ensure(
    await requestRaw(gitlabApiPath, token, "GET"),
    u.isString,
  );
}

export async function getPipelineJobs(
  url: string,
  token: string,
  attrs: { id: ProjectId; pipeline_id: number } & PaginationAttributes,
) {
  const baseApiPath =
    `${url}/api/v4/projects/${attrs.id}/pipelines/${attrs.pipeline_id}/jobs`;

  const queryPrams = objectToURLSearchParams(attrs);
  const gitlabApiPath = baseApiPath + "?" + queryPrams;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isJob),
  );
}
