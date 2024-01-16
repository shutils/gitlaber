import { Denops, fn, mapping, vars } from "../../deps.ts";

import * as types from "../../types.ts";
import {
  getCtx,
  getCurrentGitlaberInstance,
  getGitlaberVar,
  setCtx,
  setGitlaberVar,
} from "../../core.ts";
import { selectBufferInfo } from "./config.ts";
import {
  getBufferInfo,
  setBufferInfo,
  setFileType,
  setModifiable,
  setNofile,
  setNoModifiable,
} from "./helper.ts";

export async function renderBuffer(
  denops: Denops,
  bufferInfo: types.BufferInfo,
) {
  const gitlaberVar = await getGitlaberVar(denops);
  const ctx = await getCtx(denops);
  const config = bufferInfo.config;

  const nodes = await config.node_creater(denops, ctx);
  await fn.execute(denops, config.direction);
  let bufnr: number;
  if (config.tmp) {
    const bufname = await fn.tempname(denops);
    bufnr = await fn.bufadd(denops, bufname);
    await fn.bufload(denops, bufnr);
    await fn.execute(denops, `buffer ${bufnr}`);
    if (bufferInfo.autocmd) {
      await bufferInfo.autocmd({
        bufname: bufname,
      });
    }
  } else {
    bufnr = await fn.bufnr(denops);
  }
  await drawBuffer(
    denops,
    nodes,
    bufnr,
    bufferInfo.keymaps,
    config.options,
  );
  await setCtx(denops, {
    ...ctx,
    nodes: nodes,
  }, bufnr);
  await setBufferInfo(denops, bufferInfo);
  const instance = await getCurrentGitlaberInstance(denops);
  instance.buffers.push({
    resource_kind: bufferInfo.resource_kind,
    bufnr: bufnr,
  });
  gitlaberVar.instances[gitlaberVar.recent_instance_index] = instance;
  await setGitlaberVar(denops, {
    ...gitlaberVar,
    recent_instance_index: gitlaberVar.instances.findIndex((instance) =>
      instance.cwd === ctx.instance.cwd
    ),
  });
}

export async function reRenderBuffer(
  denops: Denops,
  bufnr?: number,
) {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  const bufferInfo = await getBufferInfo(denops, bufnr);
  const ctx = await getCtx(denops);
  const config = selectBufferInfo(bufferInfo.buffer_kind).config;

  const nodes = await config.node_creater(denops, ctx);
  await drawBuffer(
    denops,
    nodes,
    bufnr,
    bufferInfo.keymaps,
    config.options,
  );
  await setCtx(denops, {
    ...ctx,
    nodes: nodes,
  }, bufnr);
}

async function drawBuffer(
  denops: Denops,
  nodes: types.Node[],
  bufnr: number,
  keymaps: types.Mapping[],
  option?: types.BufferOptions,
) {
  await setModifiable(denops, bufnr);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  keymaps.map(async (keymap) => {
    await mapping.map(denops, keymap.lhs, keymap.rhs, keymap.option);
  });
  if (option?.nofile) {
    await setNofile(denops, bufnr);
  }
  if (option?.nomodifiable) {
    await setNoModifiable(denops, bufnr);
  }
  if (option?.filetype) {
    await setFileType(denops, bufnr);
  }
  await denops.cmd("redraw");
}

export const setNodesOnBuf = async (
  denops: Denops,
  nodes: Array<types.Node>,
  bufnr: number,
) => {
  const bufLines = await fn.getbufline(
    denops,
    bufnr,
    1,
    "$",
  );
  if (bufLines.length > nodes.length) {
    await fn.deletebufline(
      denops,
      bufnr,
      nodes.length + 1,
      "$",
    );
  }
  for (let i = 0; i < nodes.length; i++) {
    await fn.setbufline(denops, bufnr, i + 1, nodes[i].display);
  }
};
