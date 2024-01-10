import { autocmd, Denops, fn, helper, vars } from "../../deps.ts";

import * as util from "../../util.ts";
import * as node from "../../node.ts";
import * as types from "../../types.ts";
import * as keymap from "../../keymap.ts";
import * as client from "../../client/index.ts";

async function drawBuffer(
  denops: Denops,
  nodes: types.Node[],
  name: keymap.BufName,
  opener?: string,
  option?: {
    nofile?: boolean;
    nomodifiable?: boolean;
  },
) {
  await fn.execute(denops, opener ?? "new");
  await util.setModifiable(denops);
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await keymap.setMapping(denops, name);
  if (option?.nofile) {
    await util.setNofile(denops);
  }
  if (option?.nomodifiable) {
    await util.setNoModifiable(denops);
  }
  await denops.cmd("redraw");
}

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async openGitlaber(): Promise<void> {
      const cwd = await fn.getcwd(denops);
      const url = client.getGitlabUrl(cwd);
      const token = client.getGitlabToken(cwd);
      const singleProject = await client.getSingleProject(url, token, cwd);
      const gitlaberVar = await util.getGitlaberVar(denops);
      if (gitlaberVar.length === 0) {
        const currentGitlaberInstance: types.GitlaberInstance = {
          index: 0,
          cwd: cwd,
          project: singleProject,
          url: url,
          token: token,
        };
        gitlaberVar.push(currentGitlaberInstance);
        await vars.g.set(denops, "gitlaber_var", gitlaberVar);
      } else {
        try {
          await util.getCurrentGitlaberInstance(denops);
        } catch {
          const currentGitlaberInstance = {
            index: gitlaberVar.length,
            cwd: cwd,
            project: singleProject,
            url: url,
            token: token,
          };
          gitlaberVar.push(currentGitlaberInstance);
          await vars.g.set(denops, "gitlaber_var", gitlaberVar);
        }
      }
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const nodes = node.createMainPanelNodes(
        currentGitlaberInstance,
        singleProject,
      );
      await drawBuffer(denops, nodes, "main", "tabnew", {
        nofile: true,
        nomodifiable: true,
      });
    },

    async openProjectIssuePanel(): Promise<void> {
      const nodes = node.createProjectIssuePanelNodes();
      await drawBuffer(denops, nodes, "projectIssue", "botright new", {
        nofile: true,
        nomodifiable: true,
      });
    },

    async openProjectIssuesPanel(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      await util.setModifiable(denops);
      const projectIssues = await client.getProjectIssues(
        url,
        token,
        projectId,
      );
      const nodes = node.createProjectIssuesNodes(projectIssues);
      await drawBuffer(
        denops,
        nodes,
        "projectIssues",
        "vertical botright new",
        {
          nofile: true,
          nomodifiable: true,
        },
      );
    },

    async openProjectBranchPanel(): Promise<void> {
      const nodes = node.createProjectBranchPanelNodes();
      await drawBuffer(denops, nodes, "projectBranch", "botright new", {
        nofile: true,
        nomodifiable: true,
      });
    },

    async openProjectBranchesPanel(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectBranches = await client.getProjectBranches(url, token, {
        id: projectId,
      });
      const nodes = node.createProjectBranchesNodes(projectBranches);
      await drawBuffer(
        denops,
        nodes,
        "projectBranches",
        "vertical botright new",
        {
          nofile: true,
          nomodifiable: true,
        },
      );
    },

    async openProjectWikiPanel(): Promise<void> {
      const nodes = node.createProjectWikiPanelNodes();
      await drawBuffer(denops, nodes, "projectWiki", "botright new");
    },

    async openProjectWikisPanel(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectWikis = await client.getProjectWikis(url, token, {
        id: projectId,
      });
      const nodes = node.createProjectWikiNodes(projectWikis);
      await drawBuffer(denops, nodes, "projectWikis", "vertical botright new", {
        nofile: true,
        nomodifiable: true,
      });
    },

    async openProjectMergeRequestPanel(): Promise<void> {
      const nodes = node.createProjectMergeRequestPanelNodes();
      await drawBuffer(denops, nodes, "projectMergeRequest", "botright new", {
        nofile: true,
        nomodifiable: true,
      });
    },

    async openProjectMergeRequestsPanel(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      await util.setModifiable(denops);
      const projectMergeRequests = await client.getProjectMergeRequests(
        url,
        token,
        { id: projectId },
      );
      const nodes = node.createProjectMergeRequestsNodes(projectMergeRequests);
      await drawBuffer(
        denops,
        nodes,
        "projectMergeRequests",
        "vertical botright new",
        { nofile: true, nomodifiable: true },
      );
    },

    async openCreateNewProjectWikiBuf(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      const title = await helper.input(denops, {
        prompt: "New wiki title: ",
      });
      if (!title) {
        return;
      }
      await fn.execute(denops, "vertical botright new");
      const bufname = await fn.tempname(denops);
      const bufnr = await fn.bufadd(denops, bufname);
      await fn.bufload(denops, bufnr);
      await fn.execute(denops, `buffer ${bufnr}`);
      await vars.b.set(denops, "gitlaber_new_wiki_title", title);
      await vars.b.set(denops, "gitlaber_project_id", projectId);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call gitlaber#denops#create_new_pro_wiki()",
        );
      });
      await keymap.setMapping(denops, "base");
      await util.setFileType(denops);
      await denops.cmd("redraw");
    },

    async openProjectWikiPreview(): Promise<void> {
      const currentNode = await util.getCurrentNode(denops);
      if (!("wiki" in currentNode)) {
        return;
      }
      const nodes = node.createProjectWikiContentNodes(currentNode.wiki);
      await drawBuffer(denops, nodes, "projectWiki", "new", {
        nofile: true,
        nomodifiable: true,
      });
    },

    async openEditProjectWikiBuf(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      const currentNode = await util.getCurrentNode(denops);
      if (!("wiki" in currentNode)) {
        return;
      }
      const nodes = node.createProjectWikiContentNodes(currentNode.wiki);
      await fn.execute(denops, "new");
      const bufname = await fn.tempname(denops);
      const bufnr = await fn.bufadd(denops, bufname);
      await fn.bufload(denops, bufnr);
      await fn.execute(denops, `buffer ${bufnr}`);
      await setNodesOnBuf(denops, nodes);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await vars.b.set(denops, "gitlaber_project_id", projectId);
      await vars.b.set(denops, "gitlaber_wiki_title", currentNode.wiki.title);
      await vars.b.set(denops, "gitlaber_wiki_slug", currentNode.wiki.slug);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call gitlaber#denops#edit_wiki()",
        );
      });
      await keymap.setMapping(denops, "base");
      await util.setFileType(denops);
      await denops.cmd("redraw");
    },

    async openProjectIssuePreview(): Promise<void> {
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      if (currentNode.issue.description == null) {
        helper.echo(denops, "This issue does not have a description.");
        return;
      }
      const nodes = node.createProjectIssueDescriptionNodes(currentNode.issue);
      await drawBuffer(denops, nodes, "projectIssue", "new", {
        nofile: true,
        nomodifiable: true,
      });
    },

    async openProjectIssueEditBuf(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      const currentIssue = await util.getCurrentNode(denops);
      if (!("issue" in currentIssue)) {
        return;
      }
      await fn.execute(denops, "new");
      const nodes = node.createProjectIssueDescriptionNodes(currentIssue.issue);
      const bufname = await fn.tempname(denops);
      const bufnr = await fn.bufadd(denops, bufname);
      await fn.bufload(denops, bufnr);
      await fn.execute(denops, `buffer ${bufnr}`);
      await setNodesOnBuf(denops, nodes);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await vars.b.set(denops, "gitlaber_project_id", projectId);
      await vars.b.set(denops, "gitlaber_issue_iid", currentIssue.issue.iid);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call gitlaber#denops#edit_issue()",
        );
      });
      await keymap.setMapping(denops, "base");
      await util.setFileType(denops);
      await denops.cmd("redraw");
    },

    async reloadProjectIssues(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      await loadProjectIssues(denops, projectId);
    },

    async reloadProjectWikis(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      await loadProjectWikis(denops, projectId);
    },
  };
}

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

export const setNodesOnBuf = async (
  denops: Denops,
  nodes: Array<types.Node>,
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
