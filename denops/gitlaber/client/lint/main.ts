import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isLint } from "./types.ts";

export async function getLint(
  url: string,
  token: string,
  attrs: {
    id: number;
    content: string;
  },
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/ci/lint`;
  return u.ensure(
    await request(gitlabApiPath, token, "POST", JSON.stringify(attrs)),
    isLint,
  );
}
