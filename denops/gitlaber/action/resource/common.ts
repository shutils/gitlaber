import { fn, helper, unknownutil as u } from "../../deps.ts";

import { ActionArgs } from "../../types.ts";
import { getBuffer, updateBuffer } from "../../helper.ts";
import { reRenderBuffer } from "../../buffer/core.ts";

export async function nextList(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const buffer = await getBuffer(denops);
  const bufnr = await fn.bufnr(denops);

  // The operation will not be accepted if the end of kind in buffer is anything other than List.
  if (!/List$/.test(buffer.kind)) {
    helper.echoerr(denops, "This buffer is not supported for this operation.");
    return;
  }
  const params = u.ensure(
    buffer.params,
    u.isOptionalOf(u.isObjectOf({
      page: u.isOptionalOf(u.isNumber),
      per_page: u.isOptionalOf(u.isNumber),
      ...u.isUnknown,
    })),
  );
  let oldPage: number;
  let nextPage: number;
  if (!params || !params?.page) {
    nextPage = 2;
  } else {
    oldPage = params.page ?? 1;
    nextPage = oldPage + 1;
  }
  const updatedParams = {
    ...params,
    page: nextPage,
  };
  await updateBuffer(denops, bufnr, undefined, updatedParams);
  await reRenderBuffer(denops, bufnr);
}

export async function previousList(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const buffer = await getBuffer(denops);
  const bufnr = await fn.bufnr(denops);

  // The operation will not be accepted if the end of kind in buffer is anything other than List.
  if (!/List$/.test(buffer.kind)) {
    helper.echoerr(denops, "This buffer is not supported for this operation.");
    return;
  }
  const params = u.ensure(
    buffer.params,
    u.isOptionalOf(u.isObjectOf({
      page: u.isOptionalOf(u.isNumber),
      per_page: u.isOptionalOf(u.isNumber),
      ...u.isUnknown,
    })),
  );
  let oldPage: number;
  let previousPage: number;
  if (!params || !params?.page) {
    helper.echoerr(denops, "Previous page does not exist.");
    return;
  } else {
    oldPage = params.page ?? 1;
    previousPage = oldPage - 1;
  }
  const updatedParams = {
    ...params,
    page: previousPage,
  };
  await updateBuffer(denops, bufnr, undefined, updatedParams);
  await reRenderBuffer(denops, bufnr);
}
