import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import { ActionArgs, isWiki } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";
import * as util from "../../util.ts";
import { getBuffer } from "../../helper.ts";

export async function browseWiki(args: ActionArgs) {
  const { denops, ctx } = args;
  await openWithBrowser(denops, ctx.instance.project.web_url + "/-/wikis");
}

export async function deleteWiki(args: ActionArgs) {
  const { denops, ctx, node } = args;
  const { instance, url, token } = ctx;
  const wiki = u.ensure(node?.params, isWiki);
  const slug = wiki.slug;
  const title = wiki.title;
  const confirm = await helper.input(denops, {
    prompt: `Are you sure you want to delete the wiki(${title})? y/N: `,
  });
  if (confirm !== "y") {
    return;
  }
  await executeRequest(
    denops,
    client.deleteProjectWiki,
    url,
    token,
    {
      id: instance.project.id,
      slug: slug,
    },
    "Successfully delete a wiki.",
  );
}

export async function createWiki(args: ActionArgs) {
  const { denops, ctx } = args;
  const bufnr = await fn.bufnr(denops);
  const buffer = await getBuffer(denops, bufnr);
  const bufferParams = u.ensure(
    buffer.params,
    u.isObjectOf({
      id: u.isNumber,
      title: u.isString,
    }),
  );
  const { id, title } = bufferParams;
  const lines = await util.flattenBuffer(
    denops,
    await fn.bufname(denops, bufnr),
  );
  await executeRequest(
    denops,
    client.requestCreateNewProjectWiki,
    ctx.url,
    ctx.token,
    {
      id,
      title,
      content: lines,
    },
    "Successfully create a new wiki.",
  );
}

export async function editWikiContent(args: ActionArgs) {
  const { denops, ctx } = args;
  const bufnr = await fn.bufnr(denops);
  const buffer = await getBuffer(denops, bufnr);
  const bufferParams = u.ensure(
    buffer.params,
    u.isObjectOf({
      id: u.isNumber,
      slug: u.isString,
      title: u.isString,
    }),
  );
  const { id, slug, title } = bufferParams;

  const lines = await util.flattenBuffer(
    denops,
    await fn.bufname(denops, bufnr),
  );
  await executeRequest(
    denops,
    client.editProjectWiki,
    ctx.url,
    ctx.token,
    { id, slug, title, content: lines },
    "Successfully updated a wiki.",
  );
}

export async function ensureWiki(
  denops: Denops,
  args: ActionArgs,
) {
  if (isWiki(args.node?.params)) {
    return args.node.params;
  }
  const slug = await helper.input(denops, {
    prompt: "Wiki slug: ",
  });
  if (!slug) {
    return;
  }
  const { ctx } = args;
  const { url, token, instance } = ctx;
  const wiki = await client.getProjectWiki(url, token, {
    id: instance.project.id,
    slug: slug,
  });
  return wiki;
}
