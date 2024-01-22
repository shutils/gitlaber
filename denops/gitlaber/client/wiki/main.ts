import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isWiki } from "./types.ts";

export async function requestCreateNewProjectWiki(
  url: string,
  token: string,
  attrs: {
    id: number;
    content: string;
    title: string;
    format?: "markdown" | "rdoc" | "asciidoc" | "org";
  },
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/wikis`;
  await request(gitlabApiPath, token, "POST", JSON.stringify(attrs));
}

export async function getProjectWikis(
  url: string,
  token: string,
  attrs: { id: number; with_content?: boolean },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis?with_content=1`;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isWiki),
  );
}

export async function editProjectWiki(
  url: string,
  token: string,
  attrs: {
    id: number;
    slug: string;
    content: string;
    title: string;
    format?: "markdown" | "rdoc" | "asciidoc" | "org";
    message?: string;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  await request(gitlabApiPath, token, "PUT", JSON.stringify(attrs));
}

export async function deleteProjectWiki(
  url: string,
  token: string,
  attrs: { id: number; slug: string },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  await request(gitlabApiPath, token, "DELETE");
}
