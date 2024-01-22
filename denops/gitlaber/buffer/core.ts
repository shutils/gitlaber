import { Denops, fn, helper, mapping } from "../deps.ts";

import {} from "./config.ts";
import { BufferKind, Node } from "../types.ts";
import {
  addBuffer,
  getBuffer,
  getCurrentInstance,
  getCurrentNode,
  updateBuffer,
} from "../helper.ts";
import { getBufferConfig, setModifiable, setOptions } from "./helper.ts";

export async function createBuffer(
  denops: Denops,
  kind: BufferKind,
) {
  const config = getBufferConfig(kind);
  const instance = await getCurrentInstance(denops);
  const seedNode = await getCurrentNode(denops);
  let nodes: Node[];
  try {
    nodes = await config.nodeMaker(denops, seedNode);
  } catch (e) {
    helper.echo(denops, e.message);
    return;
  }
  let bufnr: number;
  let exists = false;
  let bufname: string;
  if (config.tmp) {
    bufname = await fn.tempname(denops);
    bufnr = await fn.bufadd(denops, bufname);
  } else {
    bufname = `${kind}\ [${instance.id}]`;
    exists = await fn.bufexists(denops, bufname);
    bufnr = await fn.bufadd(denops, `${kind}\ [${instance.id}]`);
  }
  await fn.bufload(denops, bufnr);
  await fn.execute(denops, `${config.direction} new ${bufname}`);
  await fn.execute(denops, `buffer ${bufnr}`);
  await setNodesOnBuf(denops, nodes, bufnr);
  if (config.options) {
    setOptions(denops, config.options, bufnr);
  }
  if (config.keymaps) {
    config.keymaps.map(async (keymap) => {
      await mapping.map(denops, keymap.lhs, keymap.rhs, keymap.option);
    });
  }
  if (exists) {
    await updateBuffer(denops, bufnr, nodes);
  } else {
    await addBuffer(denops, kind, bufnr, nodes);
  }
  return bufnr;
}

export async function reRenderBuffer(
  denops: Denops,
  bufnr: number,
) {
  const buffer = await getBuffer(denops, bufnr);
  const config = getBufferConfig(buffer.kind);
  if (config.tmp) {
    return;
  }
  const nodes = await config.nodeMaker(denops);
  await setModifiable(denops, bufnr);
  await setNodesOnBuf(denops, nodes, bufnr);
  if (config.options) {
    setOptions(denops, config.options, bufnr);
  }
  await updateBuffer(denops, bufnr, nodes);
  return bufnr;
}

export const setNodesOnBuf = async (
  denops: Denops,
  nodes: Node[],
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
  await denops.cmd("redraw");
};
