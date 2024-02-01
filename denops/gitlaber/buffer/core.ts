import { Denops, fn, mapping } from "../deps.ts";

import { getBufferWindowNumber } from "../util.ts";
import { BufferConfig, Node } from "../types.ts";
import {
  addBuffer,
  getBuffer,
  getBufferConfig,
  getCurrentInstance,
  updateBuffer,
} from "../helper.ts";
import { setModifiable, setOptions } from "./helper.ts";
import { setSignWithNode } from "../sign/main.ts";
import { getUserCustomBufferConfig, loadConfig } from "../config/main.ts";

export async function createBuffer(
  args: {
    denops: Denops;
    config: BufferConfig;
    nodes?: Node[];
    cmd?: string;
    seed?: Record<string, unknown>;
  },
) {
  const { denops, nodes, cmd } = args;
  let { config } = args;
  let validNodes: Node[];
  const instance = await getCurrentInstance(denops);
  const userConfig = await loadConfig(denops);
  const userBufferConfig = await getUserCustomBufferConfig(denops, config.kind);
  if (userBufferConfig) {
    config = { ...config, ...userBufferConfig };
  }
  let exists = false;
  const bufname = `${config.kind}\ [${instance.id}]`;
  exists = await fn.bufexists(denops, bufname);
  const bufnr = await fn.bufadd(denops, bufname);
  if (!exists) {
    await fn.bufload(denops, bufnr);
    await fn.execute(denops, `${config.direction} new ${cmd ?? ""}${bufname}`);
    await fn.execute(denops, `buffer ${bufnr}`);
  }
  if (!nodes && config.nodeMaker) {
    validNodes = await config.nodeMaker(denops, args.seed);
  } else {
    validNodes = nodes ?? [];
  }
  await setNodesOnBuf(denops, validNodes, bufnr);
  if (config.options) {
    setOptions(denops, config.options, bufnr);
  }

  await setSignWithNode(denops, bufnr, validNodes);
  if (config.keymaps && !userConfig?.default_keymap_disable === true) {
    config.keymaps.map(async (keymap) => {
      await mapping.map(denops, keymap.lhs, keymap.rhs, keymap.option);
    });
  }
  if (!exists) {
    await addBuffer({
      denops,
      kind: config.kind,
      bufnr,
      nodes: validNodes,
      seed: args.seed,
    });
  } else {
    await updateBuffer({ denops, bufnr, nodes: validNodes, seed: args.seed });
  }
  const winid = await getBufferWindowNumber(denops, bufnr);
  await fn.win_execute(denops, winid, "clearjumps");
  return bufnr;
}

export async function reRenderBuffer(
  denops: Denops,
  bufnr: number,
) {
  const buffer = await getBuffer(denops, bufnr);
  const seed = buffer.seed;
  const config = getBufferConfig(buffer.kind);
  if (!config.nodeMaker) {
    return;
  }
  const nodes = await config.nodeMaker(denops, seed);
  await setNodesOnBuf(denops, nodes, bufnr);
  if (config.options) {
    setOptions(denops, config.options, bufnr);
  }

  await setSignWithNode(denops, bufnr, nodes);
  await updateBuffer({ denops, bufnr, nodes });
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
  const writeLines: string[] = [];
  nodes.map((node) => {
    writeLines.push(node.display);
  });
  await fn.setbufline(denops, bufnr, 1, writeLines);
  await denops.cmd("redraw");
};
