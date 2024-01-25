import { unknownutil as u } from "../deps.ts";

import { isBufferDirection, isBufferKind } from "../types.ts";

export const isUserConfig = u.isOptionalOf(u.isObjectOf({
  custom_buffer_configs: u.isOptionalOf(
    u.isArrayOf(
      u.isObjectOf({
        kind: isBufferKind,
        direction: u.isOptionalOf(isBufferDirection),
      }),
    ),
  ),
}));

export type UserConfig = u.PredicateType<typeof isUserConfig>;
