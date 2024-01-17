import { fs } from "./deps.ts";

const dbDir = Deno.env.get("HOME") + "/.local/state/denops/gitlaber";
const dbPath = dbDir + "/database.sqlite3";

export async function initKv() {
  await Deno.mkdir(dbDir, { recursive: true });
  if (!await fs.exists(dbPath)) {
    await Deno.writeFile(dbPath, new Uint8Array([]), { create: true });
  }
}

export async function setKv(cwd: string, key: string, value: unknown) {
  const kv = await Deno.openKv(dbPath);
  const result = await kv.set([cwd, key], value);
  return result;
}

export async function getKv(cwd: string, key: string) {
  const kv = await Deno.openKv(dbPath);
  const result = await kv.get([cwd, key]);
  return result;
}
