import { Denops, fn, mapping } from "../deps.ts";

import {} from "./config.ts";
import { BufferConfig, Node } from "../types.ts";
import {
  addBuffer,
  getBuffer,
  getBufferConfig,
  getCurrentInstance,
  updateBuffer,
} from "../helper.ts";
import { setModifiable, setOptions } from "./helper.ts";
import { getUserCustomBufferConfig, loadConfig } from "../config/main.ts";

export async function createBuffer(
  denops: Denops,
  config: BufferConfig,
  nodes: Node[],
) {
  const instance = await getCurrentInstance(denops);
  const userConfig = await loadConfig(denops);
  const userBufferConfig = await getUserCustomBufferConfig(denops, config.kind);
  if (userBufferConfig) {
    config = { ...config, ...userBufferConfig };
  }
  let exists = false;
  const bufname = `${config.kind}\ [${instance.id}]`;
  exists = await fn.bufexists(denops, bufname);
  const bufnr = await fn.bufadd(denops, `${config.kind}\ [${instance.id}]`);
  if (!exists) {
    await fn.bufload(denops, bufnr);
    await fn.execute(denops, `${config.direction} new ${bufname}`);
    await fn.execute(denops, `buffer ${bufnr}`);
  }
  await setNodesOnBuf(denops, nodes, bufnr);
  if (config.options) {
    setOptions(denops, config.options, bufnr);
  }
  if (config.keymaps && !userConfig?.default_keymap_disable === true) {
    config.keymaps.map(async (keymap) => {
      await mapping.map(denops, keymap.lhs, keymap.rhs, keymap.option);
    });
  }
  if (!exists) {
    await addBuffer(denops, config.kind, bufnr, nodes);
  } else {
    await updateBuffer(denops, bufnr, nodes);
  }
  return bufnr;
}

export async function reRenderBuffer(
  denops: Denops,
  bufnr: number,
) {
  const buffer = await getBuffer(denops, bufnr);
  const config = getBufferConfig(buffer.kind);
  if (!config.nodeMaker) {
    return;
  }
  const nodes = await config.nodeMaker(denops);
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
  await setModifiable(denops, bufnr);
  const bufLines = await fn.getbufline(denops, bufnr, 1, "$");
  if (bufLines.length > 1 && bufLines[0] !== "") {
    await fn.execute(denops, `call deletebufline(${bufnr}, 1, '$')`);
  }
  for (let i = 0; i < nodes.length; i++) {
    await fn.setbufline(denops, bufnr, i + 1, nodes[i].display);
  }
  await denops.cmd("redraw");
};
