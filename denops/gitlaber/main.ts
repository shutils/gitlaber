import { Denops, fn, helper, vars } from "./deps.ts";

import {
  getProjectId,
  getProjectIssues,
  getSingleProjectResponse,
  requestCreateNewProjectIssue,
  requestDeleteProjectIssue,
} from "./client.ts";

import {
  setBaseMapping,
  setGlobalMapping,
  setMainPanelMapping,
  setProjectIssuePanelMapping,
  setProjectIssuesPanelMapping,
} from "./keymap.ts";
import {
  getCurrentNode,
  setModifiable,
  setNodesOnBuf,
  setNofile,
  setNoModifiable,
} from "./util.ts";

import { BaseNode, IssueNode } from "./types.ts";

const loadProjectIssues = async (denops: Denops) => {
  await setModifiable(denops);
  const bufLines = await fn.getbufline(
    denops,
    await fn.bufname(denops),
    1,
    "$",
  );
  const nodes: Array<BaseNode | IssueNode> = [];
  const projectId = await getProjectId();
  const projectIssues = await getProjectIssues(projectId);
  let maxIidWidth = 1;
  projectIssues.map((issue) => {
    if (maxIidWidth < issue.iid.toString().length) {
      maxIidWidth = issue.iid.toString().length;
    }
  });
  projectIssues.map((issue) => {
    nodes.push({
      display: `# ${issue.iid} ${
        Array(maxIidWidth + 1 - issue.iid.toString().length).join(" ")
      } ${issue.title}`,
      kind: "issue",
      issue: issue,
    });
  });
  if (bufLines.length > nodes.length) {
    await fn.deletebufline(
      denops,
      await fn.bufname(denops),
      nodes.length + 1,
      "$",
    );
  }
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "nodes", nodes);
  await setNoModifiable(denops);
};

export function main(denops: Denops) {
  setGlobalMapping(denops);
  denops.dispatcher = {
    async openGitlaber(): Promise<void> {
      const nodes: Array<BaseNode | IssueNode> = [];
      await fn.execute(denops, "tabnew");
      const singleProject = await getSingleProjectResponse();
      nodes.push({
        display: "Main Panel",
        kind: "other",
      });
      nodes.push({
        display: "",
        kind: "other",
      });
      nodes.push({
        display: `id: ${singleProject.id}`,
        kind: "other",
      });
      nodes.push({
        display: `name: ${singleProject.name}`,
        kind: "other",
      });
      nodes.push({
        display: `description: ${singleProject.description}`,
        kind: "other",
      });
      nodes.push({
        display: `created_at: ${singleProject.created_at}`,
        kind: "other",
      });
      nodes.push({
        display: `updated_at: ${singleProject.updated_at}`,
        kind: "other",
      });
      nodes.push({
        display: `open_issues_count: ${singleProject.open_issues_count}`,
        kind: "other",
      });
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await setMainPanelMapping(denops);
      await vars.b.set(denops, "nodes", nodes);
      await setNoModifiable(denops);
    },

    async openProjectIssuePanel(): Promise<void> {
      const nodes: Array<BaseNode> = [];
      nodes.push({
        display: "Project issue Panel",
        kind: "other",
      });
      await fn.execute(denops, "botright new");
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await setProjectIssuePanelMapping(denops);
      await vars.b.set(denops, "nodes", nodes);
      await setNoModifiable(denops);
    },

    async openProjectIssuesPanel(): Promise<void> {
      await fn.execute(denops, "vertical botright new");
      await loadProjectIssues(denops);
      await setNofile(denops);
      await setProjectIssuesPanelMapping(denops);
    },

    async createNewProjectIssue(): Promise<void> {
      const projectId = await getProjectId();
      const title = await helper.input(denops, {
        prompt: "New issue title: ",
      });
      if (!title) {
        return;
      }
      try {
        requestCreateNewProjectIssue(projectId, {
          id: projectId,
          title: title,
        });
      } catch (e) {
        console.log(e.message);
      }
    },

    async deleteProjectIssue(): Promise<void> {
      const projectId = await getProjectId();
      const currentIssue = await getCurrentNode(denops);
      if (!("issue" in currentIssue)) {
        return;
      }
      const issue_iid = currentIssue.issue.iid;
      const confirm = await helper.input(denops, {
        prompt:
          `Are you sure you want to delete the issue(${issue_iid})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        requestDeleteProjectIssue(projectId, issue_iid);
      } catch (e) {
        console.log(e.message);
      }
    },

    async openProjectIssuePreview(): Promise<void> {
      const currentIssue = await getCurrentNode(denops);
      if (!("issue" in currentIssue)) {
        return;
      }
      if (currentIssue.issue.description == null) {
        console.log("This issue does not have a description.");
        return;
      }
      const lines = currentIssue.issue.description.split("\n");
      const nodes: Array<BaseNode> = [];
      lines.map((line) => {
        nodes.push({
          display: line,
          kind: "other",
        });
      });
      await fn.execute(denops, "new");
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await vars.b.set(denops, "nodes", nodes);
      await setNoModifiable(denops);
      await setBaseMapping(denops);
    },

    async reloadProjectIssues(): Promise<void> {
      await loadProjectIssues(denops);
    },
  };
}

