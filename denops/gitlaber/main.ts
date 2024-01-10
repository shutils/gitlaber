import { autocmd, Denops, fn, helper, unknownutil, vars } from "./deps.ts";

import * as client from "./client/index.ts";
import * as keymap from "./keymap.ts";
import * as util from "./util.ts";

import * as render from "./render.ts";
import * as node from "./node.ts";

import * as types from "./types.ts";

const loadProjectIssues = async (denops: Denops, projectId: number) => {
  const currentGitlaberInstance = await util.getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await util.setModifiable(denops);
  const projectIssues = await client.getProjectIssues(url, token, projectId);
  const nodes = node.createProjectIssuesNodes(projectIssues);
  await render.setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await util.setNoModifiable(denops);
};

const loadProjectWikis = async (denops: Denops, projectId: number) => {
  const currentGitlaberInstance = await util.getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await util.setModifiable(denops);
  const projectWikis = await client.getProjectWikis(url, token, {
    id: projectId,
  });
  const nodes = node.createProjectWikiNodes(projectWikis);
  await render.setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await util.setNoModifiable(denops);
};

const loadProjectBranches = async (denops: Denops, projectId: number) => {
  const currentGitlaberInstance = await util.getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await util.setModifiable(denops);
  const projectBranches = await client.getProjectBranches(url, token, {
    id: projectId,
  });
  const nodes = node.createProjectBranchesNodes(projectBranches);
  await render.setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await util.setNoModifiable(denops);
};

export function main(denops: Denops) {
  keymap.setGlobalMapping(denops);
  denops.dispatcher = {
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
      await fn.execute(denops, "tabnew");
      const nodes = node.createMainPanelNodes(
        currentGitlaberInstance,
        singleProject,
      );
      await render.setNodesOnBuf(denops, nodes);
      await util.setNofile(denops);
      await keymap.setMainPanelMapping(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await util.setNoModifiable(denops);
      await denops.cmd("redraw");
    },

    async openProjectIssuePanel(): Promise<void> {
      await fn.execute(denops, "botright new");
      const nodes = node.createProjectIssuePanelNodes();
      await render.setNodesOnBuf(denops, nodes);
      await util.setNofile(denops);
      await keymap.setProjectIssuePanelMapping(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await util.setNoModifiable(denops);
      await denops.cmd("redraw");
    },

    async openProjectIssuesPanel(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      await fn.execute(denops, "vertical botright new");
      await loadProjectIssues(denops, projectId);
      await util.setNofile(denops);
      await keymap.setProjectIssuesPanelMapping(denops);
      await denops.cmd("redraw");
    },

    async createNewProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const title = await helper.input(denops, {
        prompt: "New issue title: ",
      });
      if (!title) {
        return;
      }
      try {
        await client.requestCreateNewProjectIssue(url, token, projectId, {
          id: projectId,
          title: title,
        });
        helper.echo(denops, "Successfully created a new issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async deleteProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      const issue_iid = currentNode.issue.iid;
      const confirm = await helper.input(denops, {
        prompt:
          `Are you sure you want to delete the issue(${issue_iid})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        await client.requestDeleteIssue(url, token, projectId, issue_iid);
        helper.echo(denops, "Successfully delete a issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
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
      await fn.execute(denops, "new");
      const nodes = node.createProjectIssueDescriptionNodes(currentNode.issue);
      await render.setNodesOnBuf(denops, nodes);
      await util.setNofile(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await util.setNoModifiable(denops);
      await keymap.setBaseMapping(denops);
      await util.setFileType(denops);
      await denops.cmd("redraw");
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
      await render.setNodesOnBuf(denops, nodes);
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
      await keymap.setBaseMapping(denops);
      await util.setFileType(denops);
      await denops.cmd("redraw");
    },

    async editProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const description = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const issue_iid = await vars.b.get(denops, "gitlaber_issue_iid");
      if (!unknownutil.isNumber(issue_iid)) {
        return;
      }
      try {
        await client.requestEditIssue(url, token, {
          id: projectId,
          issue_iid: issue_iid,
          description: description,
        });
        helper.echo(denops, "Successfully edit a issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async reloadProjectIssues(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      await loadProjectIssues(denops, projectId);
    },

    async _getCurrentNode(): Promise<types.BaseNode | types.IssueNode> {
      const currentNode = await util.getCurrentNode(denops);
      return currentNode;
    },

    async openProjectBranchPanel(): Promise<void> {
      const nodes = node.createProjectBranchPanelNodes();
      await fn.execute(denops, "botright new");
      await render.setNodesOnBuf(denops, nodes);
      await util.setNofile(denops);
      await keymap.setProjectBranchPanelMapping(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await util.setNoModifiable(denops);
      await denops.cmd("redraw");
    },

    async openProjectBranchesPanel(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      await fn.execute(denops, "vertical botright new");
      await loadProjectBranches(denops, projectId);
      await util.setNofile(denops);
      await keymap.setProjectBranchesPanelMapping(denops);
      await denops.cmd("redraw");
    },

    async createNewBranchMr(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("branch" in currentNode)) {
        helper.echoerr(denops, "This node is not branch.");
        return;
      }
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const currentBranch = currentNode.branch.name;
      const commitId = currentNode.branch.commit.short_id;
      const commit = await client.requestGetCommit(url, token, {
        id: projectId,
        sha: commitId,
      });
      const defaultTitle = commit.title;
      const defaultBranch = currentGitlaberInstance.project.default_branch;
      const terget = await helper.input(denops, {
        prompt: "Terget branch: ",
        text: defaultBranch,
      });
      if (!terget) {
        return;
      }
      const title = await helper.input(denops, {
        prompt: "Merge request title: ",
        text: defaultTitle,
      });
      if (!title) {
        return;
      }
      const confirm = await helper.input(denops, {
        prompt:
          `Are you sure you want to create a merge request? (${currentBranch} into ${terget}) y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        await client.requestCreateMergeRequest(url, token, {
          id: projectId,
          title: title,
          source_branch: currentBranch,
          target_branch: terget,
        });
        helper.echo(denops, "Successfully created a new merge request.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async openProjectWikiPanel(): Promise<void> {
      const nodes = node.createProjectWikiPanelNodes();
      await fn.execute(denops, "botright new");
      await render.setNodesOnBuf(denops, nodes);
      await util.setNofile(denops);
      await keymap.setProjectWikiPanelMapping(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await util.setNoModifiable(denops);
      await denops.cmd("redraw");
    },

    async openProjectWikisPanel(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      await fn.execute(denops, "vertical botright new");
      await loadProjectWikis(denops, projectId);
      await util.setNofile(denops);
      await keymap.setProjectWikisPanelMapping(denops);
      await denops.cmd("redraw");
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
      await keymap.setBaseMapping(denops);
      await util.setFileType(denops);
      await denops.cmd("redraw");
    },

    async createProjectNewWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const content = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const title = await vars.b.get(denops, "gitlaber_new_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      try {
        await client.requestCreateNewProjectWiki(url, token, {
          id: projectId,
          title: title,
          content: content,
        });
        helper.echo(denops, "Successfully create a new wiki.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async openProjectWikiPreview(): Promise<void> {
      const currentNode = await util.getCurrentNode(denops);
      if (!("wiki" in currentNode)) {
        return;
      }
      const nodes = node.createProjectWikiContentNodes(currentNode.wiki);
      await fn.execute(denops, "new");
      await render.setNodesOnBuf(denops, nodes);
      await util.setNofile(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await util.setNoModifiable(denops);
      await keymap.setBaseMapping(denops);
      await util.setFileType(denops);
      await denops.cmd("redraw");
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
      await render.setNodesOnBuf(denops, nodes);
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
      await keymap.setBaseMapping(denops);
      await util.setFileType(denops);
      await denops.cmd("redraw");
    },

    async editProjectWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const content = await util.flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const title = await vars.b.get(denops, "gitlaber_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      const slug = await vars.b.get(denops, "gitlaber_wiki_slug");
      if (!unknownutil.isString(slug)) {
        return;
      }
      try {
        await client.requestEditWiki(url, token, {
          id: projectId,
          title: title,
          content: content,
          slug: slug,
        });
        helper.echo(denops, "Successfully edit a wiki.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async deleteProjectWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const currentWiki = await util.getCurrentNode(denops);
      if (!("wiki" in currentWiki)) {
        return;
      }
      const slug = currentWiki.wiki.slug;
      const title = currentWiki.wiki.title;
      const confirm = await helper.input(denops, {
        prompt: `Are you sure you want to delete the wiki(${title})? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      try {
        await client.requestDeleteWiki(url, token, {
          id: projectId,
          slug: slug,
        });
        helper.echo(denops, "Successfully delete a wiki.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async reloadProjectWikis(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const projectId = currentGitlaberInstance.project.id;
      await loadProjectWikis(denops, projectId);
    },

    async openBrowserProject(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const url = currentGitlaberInstance.project.web_url;
      await util.openWithBrowser(denops, url);
    },

    async createIssueBranch(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        helper.echoerr(denops, "This node is not issue.");
        return;
      }
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const defaultBranch = currentGitlaberInstance.project.default_branch;
      const title = currentNode.issue.title;
      const issue_iid = currentNode.issue.iid;
      const branch = await helper.input(denops, {
        prompt: "New branch name: ",
        text: `${issue_iid}-${title}`,
      });
      if (!branch) {
        return;
      }
      const ref = await helper.input(denops, {
        prompt: "Ref branch name: ",
        text: defaultBranch,
      });
      if (!ref) {
        return;
      }
      try {
        await client.requestCreateIssueBranch(url, token, {
          id: projectId,
          branch: branch,
          ref: ref,
        });
        helper.echo(denops, "Successfully create a new branch.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async openBrowserIssue(): Promise<void> {
      const currentNode = await util.getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        helper.echoerr(denops, "This node is not issue.");
        return;
      }
      const url = currentNode.issue.web_url;
      await util.openWithBrowser(denops, url);
    },

    async openBrowserWiki(): Promise<void> {
      const currentGitlaberInstance = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("wiki" in currentNode)) {
        helper.echoerr(denops, "This node is not wiki.");
        return;
      }
      const projectUrl = currentGitlaberInstance.project.web_url;
      const slug = currentNode.wiki.slug;
      const url = projectUrl + "/-/wikis/" + slug;
      await util.openWithBrowser(denops, url);
    },
  };
}
