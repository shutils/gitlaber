import { Denops, fn, helper } from "./deps.ts";

export const flattenBuffer = async (denops: Denops, bufname: string) => {
  const lines = await fn.getbufline(
    denops,
    bufname,
    1,
    "$",
  );
  return lines.join("\n");
};

export function select(
  denops: Denops,
  contents: string[],
  description: string,
) {
  const texts = [description, ...contents.reverse()];
  return fn.inputlist(denops, texts);
}

export function escapeSlash(str: string) {
  return str.replaceAll("/", "%2F");
}

export async function getBufferWindowNumber(denops: Denops, bufnr: number) {
  const bufInfos = await fn.getbufinfo(denops, bufnr);
  if (bufInfos.length === 0) {
    helper.echoerr(denops, "That buffer is not visible in the window.");
  }
  return bufInfos[0].windows[0];
}

export async function focusBuffer(denops: Denops, bufnr: number) {
  const winnr = await getBufferWindowNumber(denops, bufnr);
  await fn.win_gotoid(denops, winnr);
}
