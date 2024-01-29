import { encodeurl as e, unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isFile } from "./types.ts";
import { objectToURLSearchParams } from "../helper.ts";
import { escapeSlash } from "../../util.ts";

export async function getProjectFile(
  url: string,
  token: string,
  attrs: {
    id: number | string;
    file_path: string;
    ref: string;
  },
) {
  const baseApiPath = `${url}/api/v4/projects/${attrs.id}/repository/files/${
    e.encodeUrl(escapeSlash(attrs.file_path))
  }`;

  const queryParams = objectToURLSearchParams({
    ref: attrs.ref,
  });
  const gitlabApiPath = `${baseApiPath}?${queryParams}`;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    isFile,
  );
}
