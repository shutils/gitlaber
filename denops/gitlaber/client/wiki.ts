import { unknownutil as u } from "../deps.ts";
import { createHeaders } from "./util.ts";

export const isWiki = u.isObjectOf({
  content: u.isString,
  format: u.isString,
  slug: u.isString,
  title: u.isString,
  encoding: u.isString,
  ...u.isUnknown,
});

export type Wiki = u.PredicateType<typeof isWiki>;

const isWikiGetAttributes = u.isObjectOf({
  id: u.isNumber,
  slug: u.isString,
  render_html: u.isOptionalOf(u.isBoolean),
  version: u.isOptionalOf(u.isString),
  ...u.isUnknown,
});

export type WikiGetAttributes = u.PredicateType<typeof isWikiGetAttributes>;

const isWikiGetPageAttributes = u.isObjectOf({
  id: u.isNumber,
  with_content: u.isOptionalOf(u.isBoolean),
  ...u.isUnknown,
});

export type WikisGetAttributes = u.PredicateType<
  typeof isWikiGetPageAttributes
>;

const isWikiCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  content: u.isString,
  title: u.isString,
  format: u.isOptionalOf(
    u.isLiteralOneOf(["markdown", "rdoc", "asciidoc", "org"] as const),
  ),
  ...u.isUnknown,
});

export type WikiCreateAttributes = u.PredicateType<
  typeof isWikiCreateAttributes
>;

const isWikiEditAttributes = u.isObjectOf({
  id: u.isNumber,
  content: u.isString,
  title: u.isString,
  format: u.isOptionalOf(
    u.isLiteralOneOf(["markdown", "rdoc", "asciidoc", "org"] as const),
  ),
  slug: u.isString,
  ...u.isUnknown,
});

export type WikiEditAttributes = u.PredicateType<typeof isWikiEditAttributes>;

const isWikiDeleteAttributes = u.isObjectOf({
  id: u.isNumber,
  slug: u.isString,
  ...u.isUnknown,
});

export type WikiDeleteAttributes = u.PredicateType<
  typeof isWikiDeleteAttributes
>;

export async function requestCreateNewProjectWiki(
  url: string,
  token: string,
  attrs: WikiCreateAttributes,
): Promise<void> {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/wikis`;
  const res = await fetch(gitlabApiPath, {
    method: "POST",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new wiki.");
  }
}

export async function getProjectWikis(
  url: string,
  token: string,
  attrs: WikisGetAttributes,
): Promise<Wiki[]> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis?with_content=1`;
  const res = await fetch(gitlabApiPath, {
    method: "GET",
    headers: createHeaders(token),
  });
  return res.json();
}

export async function requestEditWiki(
  url: string,
  token: string,
  attrs: WikiEditAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  const res = await fetch(gitlabApiPath, {
    method: "PUT",
    headers: createHeaders(token),
    body: JSON.stringify(attrs),
  });
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit wiki.");
  }
}

export async function requestDeleteWiki(
  url: string,
  token: string,
  attrs: WikiDeleteAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/wikis/${attrs.slug}`;
  const res = await fetch(gitlabApiPath, {
    method: "DELETE",
    headers: createHeaders(token),
  });
  if (res.status != 204) {
    throw new Error("Failed to delete a wiki.");
  }
}
