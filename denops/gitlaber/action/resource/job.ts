import { fn, helper, unknownutil as u } from "../../deps.ts";
import * as client from "../../client/index.ts";
import { ActionArgs, Job, JobListSeed, JobLogSeed, Node } from "../../types.ts";
import * as util from "../../util.ts";
import { executeRequest } from "./core.ts";
import { openWithBrowser } from "../browse/core.ts";
import { openUiSelect } from "../ui/main.ts";
import { createBuffer } from "../../buffer/core.ts";
import { getBufferConfig } from "../../helper.ts";
import { argsHasJob, getJobFromArgs } from "./common.ts";

export async function openJobList(args: ActionArgs): Promise<void> {
  const { denops } = args;
  const config = getBufferConfig("GitlaberJobList");
  const seed: JobListSeed = {
    url: args.ctx.url,
    token: args.ctx.token,
    id: args.ctx.instance.project.id,
  };
  const bufnr = await createBuffer({ denops, config, seed });
  await util.focusBuffer(args.denops, bufnr);
}

export async function browseJob(args: ActionArgs): Promise<void> {
  const { denops } = args;
  let job: Job;
  if (argsHasJob(args)) {
    job = getJobFromArgs(args);
  } else {
    selectJob(args);
    return;
  }
  await openWithBrowser(denops, job.web_url);
}

export async function openJobLog(args: ActionArgs): Promise<void> {
  const { denops } = args;
  let job: Job;
  if (argsHasJob(args)) {
    job = getJobFromArgs(args);
  } else {
    selectJob(args);
    return;
  }
  const config = getBufferConfig("GitlaberJobLog");
  const seed: JobLogSeed = {
    url: args.ctx.url,
    token: args.ctx.token,
    id: args.ctx.instance.project.id,
    job_id: job.id,
  };
  const bufnr = await createBuffer({ denops, config, seed });
  await util.focusBuffer(args.denops, bufnr);
}

async function selectJob(args: ActionArgs): Promise<void> {
  const { url, token, instance } = args.ctx;
  const id = instance.project.id;
  const jobs = await client.getProjectJobs(url, token, { id });
  const nodes: Node[] = [];
  jobs.map((job) => {
    nodes.push({
      display: `${job.id} ${job.name} ${job.status}`,
      params: {
        action: {
          name: args.name,
          params: { ...args.params, job: job },
        },
      },
    });
  });
  await openUiSelect(args, nodes);
}
