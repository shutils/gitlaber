import { autocmd, Denops, fn, helper, unknownutil, vars } from "./deps.ts";

import {
  getGitlabToken,
  getGitlabUrl,
  getProjectIssues,
  getProjectWikis,
  getSingleProject,
  requestCreateNewProjectIssue,
  requestCreateNewProjectWiki,
  requestDeleteIssue,
  requestDeleteWiki,
  requestEditIssue,
  requestEditWiki,
} from "./client.ts";

import {
  setBaseMapping,
  setGlobalMapping,
  setMainPanelMapping,
  setProjectIssuePanelMapping,
  setProjectIssuesPanelMapping,
  setProjectWikiPanelMapping,
  setProjectWikisPanelMapping,
} from "./keymap.ts";
import {
  getCurrentGitlaberInstance,
  getCurrentNode,
  getGitlaberVar,
  setFileType,
  setModifiable,
  setNofile,
  setNoModifiable,
} from "./util.ts";

import { setNodesOnBuf } from "./render.ts";
import {
  createMainPanelNodes,
  createProjectIssueDescriptionNodes,
  createProjectIssuePanelNodes,
  createProjectIssuesNodes,
  createProjectWikiContentNodes,
  createProjectWikiNodes,
  createProjectWikiPanelNodes,
} from "./node.ts";

import { BaseNode, GitlaberInstance, IssueNode } from "./types.ts";

const loadProjectIssues = async (denops: Denops, projectId: number) => {
  const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await setModifiable(denops);
  const projectIssues = await getProjectIssues(url, token, projectId);
  const nodes = createProjectIssuesNodes(projectIssues);
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await setNoModifiable(denops);
};

const loadProjectWikis = async (denops: Denops, projectId: number) => {
  const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
  const url = currentGitlaberInstance.url;
  const token = currentGitlaberInstance.token;
  await setModifiable(denops);
  const projectWikis = await getProjectWikis(url, token, { id: projectId });
  const nodes = createProjectWikiNodes(projectWikis);
  await setNodesOnBuf(denops, nodes);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await setNoModifiable(denops);
};

export function main(denops: Denops) {
  setGlobalMapping(denops);
  denops.dispatcher = {
    async openGitlaber(): Promise<void> {
      const cwd = await fn.getcwd(denops);
      const url = getGitlabUrl(cwd);
      const token = getGitlabToken(cwd);
      const singleProject = await getSingleProject(url, token, cwd);
      const gitlaberVar = await getGitlaberVar(denops);
      if (gitlaberVar.length === 0) {
        const currentGitlaberInstance: GitlaberInstance = {
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
          await getCurrentGitlaberInstance(denops);
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
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      await fn.execute(denops, "tabnew");
      const nodes = createMainPanelNodes(
        currentGitlaberInstance,
        singleProject,
      );
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await setMainPanelMapping(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await setNoModifiable(denops);
    },

    async openProjectIssuePanel(): Promise<void> {
      await fn.execute(denops, "botright new");
      const nodes = createProjectIssuePanelNodes();
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await setProjectIssuePanelMapping(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await setNoModifiable(denops);
    },

    async openProjectIssuesPanel(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const projectId = currentGitlaberInstance.project.id;
      await fn.execute(denops, "vertical botright new");
      await loadProjectIssues(denops, projectId);
      await setNofile(denops);
      await setProjectIssuesPanelMapping(denops);
    },

    async createNewProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
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
        await requestCreateNewProjectIssue(url, token, projectId, {
          id: projectId,
          title: title,
        });
        helper.echo(denops, "Successfully created a new issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async deleteProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const currentNode = await getCurrentNode(denops);
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
        await requestDeleteIssue(url, token, projectId, issue_iid);
        helper.echo(denops, "Successfully delete a issue.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async openProjectIssuePreview(): Promise<void> {
      const currentNode = await getCurrentNode(denops);
      if (!("issue" in currentNode)) {
        return;
      }
      if (currentNode.issue.description == null) {
        helper.echo(denops, "This issue does not have a description.");
        return;
      }
      await fn.execute(denops, "new");
      const nodes = createProjectIssueDescriptionNodes(currentNode.issue);
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await setNoModifiable(denops);
      await setBaseMapping(denops);
      await setFileType(denops);
    },

    async openProjectIssueEditBuf(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const projectId = currentGitlaberInstance.project.id;
      const currentIssue = await getCurrentNode(denops);
      if (!("issue" in currentIssue)) {
        return;
      }
      await fn.execute(denops, "new");
      const nodes = createProjectIssueDescriptionNodes(currentIssue.issue);
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
      await setBaseMapping(denops);
      await setFileType(denops);
    },

    async editProjectIssue(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const lines = await fn.getbufline(
        denops,
        await fn.bufname(denops),
        1,
        "$",
      );
      const description = lines.join("\n");
      const issue_iid = await vars.b.get(denops, "gitlaber_issue_iid");
      if (!unknownutil.isNumber(issue_iid)) {
        return;
      }
      try {
        await requestEditIssue(url, token, {
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
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const projectId = currentGitlaberInstance.project.id;
      await loadProjectIssues(denops, projectId);
    },

    async _getCurrentNode(): Promise<BaseNode | IssueNode> {
      const currentNode = await getCurrentNode(denops);
      return currentNode;
    },

    async openProjectWikiPanel(): Promise<void> {
      const nodes = createProjectWikiPanelNodes();
      await fn.execute(denops, "botright new");
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await setProjectWikiPanelMapping(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await setNoModifiable(denops);
    },

    async openProjectWikisPanel(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const projectId = currentGitlaberInstance.project.id;
      await fn.execute(denops, "vertical botright new");
      await loadProjectWikis(denops, projectId);
      await setNofile(denops);
      await setProjectWikisPanelMapping(denops);
    },

    async openCreateNewProjectWikiBuf(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
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
      await setBaseMapping(denops);
      await setFileType(denops);
    },

    async createProjectNewWiki(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const lines = await fn.getbufline(
        denops,
        await fn.bufname(denops),
        1,
        "$",
      );
      const content = lines.join("\n");
      const title = await vars.b.get(denops, "gitlaber_new_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      try {
        await requestCreateNewProjectWiki(url, token, {
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
      const currentNode = await getCurrentNode(denops);
      if (!("wiki" in currentNode)) {
        return;
      }
      const nodes = createProjectWikiContentNodes(currentNode.wiki);
      await fn.execute(denops, "new");
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await setNoModifiable(denops);
      await setBaseMapping(denops);
      await setFileType(denops);
    },

    async openEditProjectWikiBuf(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const projectId = currentGitlaberInstance.project.id;
      const currentNode = await getCurrentNode(denops);
      if (!("wiki" in currentNode)) {
        return;
      }
      const nodes = createProjectWikiContentNodes(currentNode.wiki);
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
      await setBaseMapping(denops);
      await setFileType(denops);
    },

    async editProjectWiki(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const lines = await fn.getbufline(
        denops,
        await fn.bufname(denops),
        1,
        "$",
      );
      const content = lines.join("\n");
      const title = await vars.b.get(denops, "gitlaber_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      const slug = await vars.b.get(denops, "gitlaber_wiki_slug");
      if (!unknownutil.isString(slug)) {
        return;
      }
      try {
        await requestEditWiki(url, token, {
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
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const url = currentGitlaberInstance.url;
      const token = currentGitlaberInstance.token;
      const projectId = currentGitlaberInstance.project.id;
      const currentWiki = await getCurrentNode(denops);
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
        await requestDeleteWiki(url, token, { id: projectId, slug: slug });
        helper.echo(denops, "Successfully delete a wiki.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },

    async reloadProjectWikis(): Promise<void> {
      const currentGitlaberInstance = await getCurrentGitlaberInstance(denops);
      const projectId = currentGitlaberInstance.project.id;
      await loadProjectWikis(denops, projectId);
    },
  };
}
