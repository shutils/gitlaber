import { helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import { ActionArgs, isWiki } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";

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
