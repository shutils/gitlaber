import { Denops, fn } from "../deps.ts";

import { SignGroup } from "./types.ts";

export async function defineSign(
  denops: Denops,
  name: SignGroup,
  text: string,
) {
  await fn.execute(
    denops,
    `sign define ${name} text=${text}`,
  );
}

export async function initSign(denops: Denops) {
  await defineSign(denops, "GitlaberDiscussion", "󰍢");
}

export async function clearSign(
  denops: Denops,
  bufnr: number,
  group: SignGroup,
) {
  await fn.execute(
    denops,
    `sign unplace * group=${group} buffer=${bufnr}`,
  );
}

export async function setSign(
  denops: Denops,
  id: number,
  lnum: number,
  name: SignGroup,
  bufnr: number,
  group: SignGroup,
) {
  await fn.execute(
    denops,
    `sign place ${id} line=${lnum} name=${name} group=${group} buffer=${bufnr}`,
  );
}
