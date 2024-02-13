import { fn, helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import {
  ActionArgs,
  isWiki,
  Node,
  Wiki,
  WikiEditSeed,
  WikiListSeed,
  WikiPreviewSeed,
} from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";
import * as util from "../../util.ts";
import { getBuffer, updateBuffer } from "../../helper.ts";
import { getBufferConfig } from "../../helper.ts";
import { createBuffer } from "../../buffer/core.ts";
import { createContentNodes } from "../../node/main.ts";
import { openUiSelect } from "../ui/main.ts";

export async function openWikiList(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiList");
  const seed: WikiListSeed = {
    url: args.ctx.url,
    token: args.ctx.token,
    id: args.ctx.instance.project.id,
  };
  const bufnr = await createBuffer({ denops: args.denops, config, seed });
  await util.focusBuffer(args.denops, bufnr);
}

export async function openWikiConfig(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiConfig");
  const bufnr = await createBuffer({ denops: args.denops, config });
  await fn.execute(
    args.denops,
    `autocmd WinLeave <buffer> bw ${bufnr}`,
  );
}

export async function openWikiPreview(args: ActionArgs): Promise<void> {
  const config = getBufferConfig("GitlaberWikiPreview");
  let wiki: Wiki;
  if (argsHasWiki(args)) {
    wiki = getWikiFromArgs(args);
  } else {
    selectWiki(args);
    return;
  }
  const seed: WikiPreviewSeed = {
    url: args.ctx.url,
    token: args.ctx.token,
    id: args.ctx.instance.project.id,
    slug: wiki.slug,
  };
  await createBuffer({ denops: args.denops, config, seed });
}

export async function openWikiEdit(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const config = getBufferConfig("GitlaberWikiEdit");
  let wiki: Wiki;
  if (argsHasWiki(args)) {
    wiki = getWikiFromArgs(args);
  } else {
    selectWiki(args);
    return;
  }
  const id = args.ctx.instance.project.id;
  const slug = wiki.slug;
  const title = wiki.title;
  const seed: WikiEditSeed = {
    url: args.ctx.url,
    token: args.ctx.token,
    id: args.ctx.instance.project.id,
    slug: wiki.slug,
  };
  const bufnr = await createBuffer({ denops: args.denops, config, seed });
  await updateBuffer({ denops, bufnr, params: { id, slug, title } });
}

export async function openWikiNew(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const config = getBufferConfig("GitlaberWikiNew");
  const id = args.ctx.instance.project.id;
  const title = await helper.input(args.denops, {
    prompt: "New wiki title: ",
  });
  if (!title) {
    return;
  }
  const nodes = await createContentNodes({ title, content: "" });
  const bufnr = await createBuffer({ denops: args.denops, config, nodes });
  await updateBuffer({ denops, bufnr, params: { id, title } });
}

export async function browseWiki(args: ActionArgs) {
  const { denops, ctx } = args;
  const baseUrl = ctx.instance.project.web_url + "/-/wikis/";
  let wiki: Wiki;
  if (argsHasWiki(args)) {
    wiki = getWikiFromArgs(args);
  } else {
    selectWiki(args);
    return;
  }
  const escapedSlug = encodeURIComponent(wiki.slug);
  await openWithBrowser(denops, baseUrl + escapedSlug);
}

export async function deleteWiki(args: ActionArgs) {
  const { denops, ctx, node } = args;
  const { instance, url, token } = ctx;
  let wiki: Wiki;
  if (isWiki(node?.params?.wiki)) {
    wiki = node.params.wiki;
  } else if (isWiki(args.params?.wiki)) {
    wiki = args.params.wiki;
  } else {
    selectWiki(args);
    return;
  }
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
      slug,
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

function argsHasWiki(args: ActionArgs) {
  if (isWiki(args.params?.wiki)) {
    return true;
  } else if (isWiki(args.node?.params?.wiki)) {
    return true;
  }
  return false;
}

function getWikiFromArgs(args: ActionArgs) {
  if (isWiki(args.params?.wiki)) {
    return args.params.wiki;
  } else if (isWiki(args.node?.params?.wiki)) {
    return args.node.params.wiki;
  }
  throw new Error("Wiki not found.");
}

async function selectWiki(args: ActionArgs): Promise<void> {
  const { denops, ctx } = args;
  const { url, token, instance } = ctx;
  const wikis = await client.getProjectWikis(url, token, {
    id: instance.project.id,
  });
  if (wikis.length === 0) {
    helper.echo(denops, "Project has not wikis.");
    return;
  }
  const nodes: Node[] = [];
  wikis.map((wiki) => {
    nodes.push({
      display: wiki.title,
      params: {
        name: args.name,
        params: { wiki },
      },
    });
  });
  await openUiSelect(args, nodes);
}
