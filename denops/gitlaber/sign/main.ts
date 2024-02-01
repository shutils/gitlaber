import { Denops, fn, unknownutil as u } from "../deps.ts";

import { Node } from "../types.ts";
import { SIGN_GROUPS, SignGroup } from "./types.ts";

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

export async function setSignWithNode(
  denops: Denops,
  bufnr: number,
  nodes: Node[],
) {
  const validNodes = u.ensure(
    nodes,
    u.isArrayOf(u.isObjectOf({
      params: u.isOptionalOf(u.isObjectOf({
        sign: u.isOptionalOf(u.isObjectOf({
          name: u.isLiteralOneOf(SIGN_GROUPS),
          group: u.isLiteralOneOf(SIGN_GROUPS),
        })),
        ...u.isUnknown,
      })),
    })),
  );
  if (validNodes.length === 0) {
    return;
  }
  await clearSign(denops, bufnr, "GitlaberDiscussion");
  for (let i = 0; i < validNodes.length; i++) {
    const node = validNodes[i];
    if (
      !u.isObjectOf({
        params: u.isObjectOf({
          sign: u.isObjectOf({
            name: u.isLiteralOneOf(SIGN_GROUPS),
            group: u.isLiteralOneOf(SIGN_GROUPS),
          }),
          ...u.isUnknown,
        }),
      })(node)
    ) {
      continue;
    }
    await setSign(
      denops,
      i,
      i + 1,
      node.params.sign.name,
      bufnr,
      node.params.sign.group,
    );
  }
}
