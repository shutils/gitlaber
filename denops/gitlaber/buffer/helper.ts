import { Denops, fn } from "../deps.ts";

import { BUFFER_CONFIGS } from "./config.ts";
import { BufferKind, BufferOptions } from "./types.ts";

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

export function getBufferConfig(kind: BufferKind) {
  const config = BUFFER_CONFIGS.find((config) => config.kind === kind);
  if (!config) {
    throw new Error(`Buffer config is not found: ${kind}`);
  }
  return config;
}
