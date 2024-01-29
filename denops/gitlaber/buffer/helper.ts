import { Denops, fn } from "../deps.ts";

import { BufferOptions } from "./types.ts";

export const setNofile = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&buftype",
    "nofile",
  );
};

export const setFileType = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&filetype",
    "markdown",
  );
};

export const setModifiable = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&modifiable",
    true,
  );
};

export const setNoModifiable = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&modifiable",
    false,
  );
};

export function setOptions(
  denops: Denops,
  options: BufferOptions,
  bufnr: number,
) {
  Object.entries(options).map(async ([key, value]) => {
    await fn.setbufvar(denops, bufnr, "&" + key, value);
  });
}

export function setDiffOptions(
  denops: Denops,
  bufnr: number,
) {
  const options = {
    diff: true,
    scrollbind: true,
    cursorbind: true,
    scrollopt: "hor",
    wrap: false,
    foldmethod: "diff",
    foldcolumn: 2,
  };
  Object.entries(options).map(async ([key, value]) => {
    await fn.setbufvar(denops, bufnr, "&" + key, value);
  });
}
