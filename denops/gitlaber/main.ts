import { autocmd, Denops, fn, helper, unknownutil, vars } from "./deps.ts";

import {
  getProjectId,
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
  getCurrentNode,
  setFileType,
  setModifiable,
  setNodesOnBuf,
  setNofile,
  setNoModifiable,
} from "./util.ts";

import {
  BaseNode,
  EditIssueAttributes,
  IssueNode,
  WikiCreateAttributes,
  WikiDeleteAttributes,
  WikiEditAttributes,
  WikiNode,
} from "./types.ts";

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

const loadProjectWikis = async (denops: Denops) => {
  await setModifiable(denops);
  const bufLines = await fn.getbufline(
    denops,
    await fn.bufname(denops),
    1,
    "$",
  );
  const nodes: Array<BaseNode | WikiNode> = [];
  const projectId = await getProjectId();
  const projectWikis = await getProjectWikis({ id: projectId });
  projectWikis.map((wiki) => {
    nodes.push({
      display: `${wiki.title}`,
      kind: "wiki",
      wiki: wiki,
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
      const singleProject = await getSingleProject();
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
        requestDeleteIssue(projectId, issue_iid);
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
      await setFileType(denops);
    },

    async openProjectIssueEditBuf(): Promise<void> {
      const projectId = await getProjectId();
      const currentIssue = await getCurrentNode(denops);
      if (!("issue" in currentIssue)) {
        return;
      }
      let lines = [""];
      if (currentIssue.issue.description != null) {
        lines = currentIssue.issue.description.split("\n");
      }
      const nodes: Array<BaseNode> = [];
      lines.map((line) => {
        nodes.push({
          display: line,
          kind: "other",
        });
      });
      await fn.execute(denops, "new");
      const bufname = await fn.tempname(denops);
      const bufnr = await fn.bufadd(denops, bufname);
      await fn.bufload(denops, bufnr);
      await fn.execute(denops, `buffer ${bufnr}`);
      await setNodesOnBuf(denops, nodes);
      await vars.b.set(denops, "nodes", nodes);
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
      const lines = await fn.getbufline(
        denops,
        await fn.bufname(denops),
        1,
        "$",
      );
      const description = lines.join("\n");
      const projectId = await vars.b.get(denops, "gitlaber_project_id");
      if (!unknownutil.isNumber(projectId)) {
        return;
      }
      const issue_iid = await vars.b.get(denops, "gitlaber_issue_iid");
      if (!unknownutil.isNumber(issue_iid)) {
        return;
      }
      const attributes: EditIssueAttributes = {
        id: projectId,
        issue_iid: issue_iid,
        description: description,
      };
      await requestEditIssue(attributes);
    },

    async reloadProjectIssues(): Promise<void> {
      await loadProjectIssues(denops);
    },

    async _getCurrentNode(): Promise<BaseNode | IssueNode> {
      const currentNode = await getCurrentNode(denops);
      return currentNode;
    },

    async openProjectWikiPanel(): Promise<void> {
      const nodes: Array<BaseNode> = [];
      nodes.push({
        display: "Project wiki Panel",
        kind: "other",
      });
      await fn.execute(denops, "botright new");
      await setNodesOnBuf(denops, nodes);
      await setNofile(denops);
      await setProjectWikiPanelMapping(denops);
      await vars.b.set(denops, "nodes", nodes);
      await setNoModifiable(denops);
    },

    async openProjectWikisPanel(): Promise<void> {
      await fn.execute(denops, "vertical botright new");
      await loadProjectWikis(denops);
      await setNofile(denops);
      await setProjectWikisPanelMapping(denops);
    },

    async openCreateNewProjectWikiBuf(): Promise<void> {
      const projectId = await getProjectId();
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
      const lines = await fn.getbufline(
        denops,
        await fn.bufname(denops),
        1,
        "$",
      );
      const content = lines.join("\n");
      const projectId = await vars.b.get(denops, "gitlaber_project_id");
      if (!unknownutil.isNumber(projectId)) {
        return;
      }
      const title = await vars.b.get(denops, "gitlaber_new_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      const attributes: WikiCreateAttributes = {
        id: projectId,
        title: title,
        content: content,
      };
      await requestCreateNewProjectWiki(attributes);
    },

    async openProjectWikiPreview(): Promise<void> {
      const currentWiki = await getCurrentNode(denops);
      if (!("wiki" in currentWiki)) {
        return;
      }
      const lines = currentWiki.wiki.content.split("\n");
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
      await setFileType(denops);
    },

    async openEditProjectWikiBuf(): Promise<void> {
      const projectId = await getProjectId();
      const currentWiki = await getCurrentNode(denops);
      if (!("wiki" in currentWiki)) {
        return;
      }
      const lines = currentWiki.wiki.content.split("\n");
      const nodes: Array<BaseNode> = [];
      lines.map((line) => {
        nodes.push({
          display: line,
          kind: "other",
        });
      });
      await fn.execute(denops, "new");
      const bufname = await fn.tempname(denops);
      const bufnr = await fn.bufadd(denops, bufname);
      await fn.bufload(denops, bufnr);
      await fn.execute(denops, `buffer ${bufnr}`);
      await setNodesOnBuf(denops, nodes);
      await vars.b.set(denops, "nodes", nodes);
      await vars.b.set(denops, "gitlaber_project_id", projectId);
      await vars.b.set(denops, "gitlaber_wiki_title", currentWiki.wiki.title);
      await vars.b.set(denops, "gitlaber_wiki_slug", currentWiki.wiki.slug);
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
      const lines = await fn.getbufline(
        denops,
        await fn.bufname(denops),
        1,
        "$",
      );
      const content = lines.join("\n");
      const projectId = await vars.b.get(denops, "gitlaber_project_id");
      if (!unknownutil.isNumber(projectId)) {
        return;
      }
      const title = await vars.b.get(denops, "gitlaber_wiki_title");
      if (!unknownutil.isString(title)) {
        return;
      }
      const slug = await vars.b.get(denops, "gitlaber_wiki_slug");
      if (!unknownutil.isString(slug)) {
        return;
      }
      const attributes: WikiEditAttributes = {
        id: projectId,
        title: title,
        content: content,
        slug: slug,
      };
      requestEditWiki(attributes);
    },

    async deleteProjectWiki(): Promise<void> {
      const projectId = await getProjectId();
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
      const attributes: WikiDeleteAttributes = {
        id: projectId,
        slug: slug,
      };
      try {
        requestDeleteWiki(attributes);
      } catch (e) {
        console.log(e.message);
      }
    },

    async reloadProjectWikis(): Promise<void> {
      await loadProjectWikis(denops);
    },
  };
}
