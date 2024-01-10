import { Denops, fn, vars } from "./deps.ts";

import { Node } from "./types.ts";
import * as util from "./util.ts";
import * as client from "./client/index.ts";
import * as node from "./node.ts";

export const setNodesOnBuf = async (
  denops: Denops,
  nodes: Array<Node>,
) => {
  const bufLines = await fn.getbufline(
    denops,
    await fn.bufname(denops),
    1,
    "$",
  );
  if (bufLines.length > nodes.length) {
    await fn.deletebufline(
      denops,
      await fn.bufname(denops),
      nodes.length + 1,
      "$",
    );
  }
  for (let i = 0; i < nodes.length; i++) {
    await fn.setline(denops, i + 1, nodes[i].display);
  }
};

export const loadProjectIssues = async (denops: Denops, projectId: number) => {
  const currentGitlaberInstance = await util.getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await util.setModifiable(denops);
  const projectIssues = await client.getProjectIssues(url, token, projectId);
  const nodes = node.createProjectIssuesNodes(projectIssues);
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await util.setNoModifiable(denops);
};

export const loadProjectWikis = async (denops: Denops, projectId: number) => {
  const currentGitlaberInstance = await util.getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await util.setModifiable(denops);
  const projectWikis = await client.getProjectWikis(url, token, {
    id: projectId,
  });
  const nodes = node.createProjectWikiNodes(projectWikis);
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await util.setNoModifiable(denops);
};

export const loadProjectBranches = async (
  denops: Denops,
  projectId: number,
) => {
  const currentGitlaberInstance = await util.getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await util.setModifiable(denops);
  const projectBranches = await client.getProjectBranches(url, token, {
    id: projectId,
  });
  const nodes = node.createProjectBranchesNodes(projectBranches);
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await util.setNoModifiable(denops);
};

export const loadProjectMergeRequests = async (
  denops: Denops,
  projectId: number,
) => {
  const currentGitlaberInstance = await util.getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await util.setModifiable(denops);
  const projectMergeRequests = await client.getProjectMergeRequests(
    url,
    token,
    { id: projectId },
  );
  const nodes = node.createProjectMergeRequestsNodes(projectMergeRequests);
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await util.setNoModifiable(denops);
};
