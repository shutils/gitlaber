import { Denops, unknownutil as u, vars } from "../deps.ts";

import { isUserConfig } from "./types.ts";
import { BufferKind } from "../types.ts";

export async function loadConfig(denops: Denops) {
  const userConfigVar = await vars.g.get(denops, "gitlaber_config");
  if (!userConfigVar) {
    return;
  }
  return u.ensure(userConfigVar, isUserConfig);
}

export async function getUserCustomBufferConfig(
  denops: Denops,
  kind: BufferKind,
) {
  const config = await loadConfig(denops);
  if (!config) {
    return;
  }
  return config.custom_buffer_configs?.find((c) => c.kind === kind);
}
