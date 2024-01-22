import { mapping } from "../deps.ts";

export type Keymap = {
  lhs: string;
  rhs: string;
  option?: mapping.MapOptions;
  description?: string;
};
