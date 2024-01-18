import { Denops, fn, unknownutil as u } from "../../deps.ts";

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

export async function setBufferInfo(
  denops: Denops,
  bufferInfo: BufferInfo,
  bufnr?: number,
) {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  await fn.setbufvar(denops, bufnr, "gitlaber_buffer_info", bufferInfo);
}

export async function getBufferInfo(
  denops: Denops,
  bufnr?: number,
): Promise<BufferInfo> {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  const bufferInfo = await fn.getbufvar(denops, bufnr, "gitlaber_buffer_info");
  if (
    u.isObjectOf({
      buffer_kind: u.isString,
      ...u.isUnknown,
    })
  ) {
    return (bufferInfo as BufferInfo);
  } else {
    throw new Error("buffer info is not set");
  }
}
