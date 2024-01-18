import { request } from "../core.ts";
import { Wiki } from "./types.ts";

export async function requestCreateNewProjectWiki(
  url: string,
  token: string,
  attrs: {
    id: number;
    content: string;
    title: string;
    format?: "markdown" | "rdoc" | "asciidoc" | "org";
  },
): Promise<void> {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/wikis`;
  const res = await request(
    gitlabApiPath,
    token,
    "POST",
    JSON.stringify(attrs),
  );
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new wiki.");
  }
}

export async function getProjectWikis(
  url: string,
  token: string,
  attrs: {
    id: number;
    with_content?: boolean;
  },
): Promise<Wiki[]> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis?with_content=1`;
  const res = await request(gitlabApiPath, token, "GET");
  return res.json();
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
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  const res = await request(gitlabApiPath, token, "PUT", JSON.stringify(attrs));
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit wiki.");
  }
}

export async function deleteProjectWiki(
  url: string,
  token: string,
  attrs: {
    id: number;
    slug: string;
  },
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  const res = await request(gitlabApiPath, token, "DELETE");
  if (res.status != 204) {
    throw new Error("Failed to delete a wiki.");
  }
}
