import { Denops } from "../deps.ts";

import { createBuffer, reRenderBuffer } from "./core.ts";
import { getCurrentInstance } from "../helper.ts";
import { ActionArgs } from "../types.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async "command:buffer:autoreload"(): Promise<void> {
      const instance = await getCurrentInstance(denops);
      const bufnrs = instance.bufnrs;
      bufnrs.forEach(async (bufnr) => {
        await reRenderBuffer(denops, bufnr);
      });
    },
  };
}

export async function openIssueList(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberIssueList");
}

export async function openIssueConfig(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberIssueConfig");
}

export async function openBranchList(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberBranchList");
}

export async function openBranchConfig(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberBranchConfig");
}

export async function openWikiList(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberWikiList");
}

export async function openWikiConfig(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberWikiConfig");
}

export async function openMrList(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberMrList");
}

export async function openMrConfig(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberMrConfig");
}

export async function openProjectStatus(args: ActionArgs): Promise<void> {
  await createBuffer(args.denops, "GitlaberProjectStatus");
}
