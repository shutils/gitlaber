import { Denops, fn } from "./deps.ts";

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
