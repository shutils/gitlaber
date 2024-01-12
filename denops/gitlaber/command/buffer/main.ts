import {
  autocmd,
  Denops,
  fn,
  helper,
  unknownutil as u,
  vars,
} from "../../deps.ts";

import * as util from "../../util.ts";
import * as node from "../../node.ts";
import * as types from "../../types.ts";
import * as keymap from "../../keymap.ts";
import * as client from "../../client/index.ts";
import { getCtx, setCtx } from "../../core.ts";

async function drawBuffer(
  denops: Denops,
  nodes: types.Node[],
  name: keymap.BufName,
  bufnr: number,
  option?: {
    nofile?: boolean;
    nomodifiable?: boolean;
    filetype?: string;
  },
) {
  await setModifiable(denops, bufnr);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await keymap.setMapping(denops, name);
  if (option?.nofile) {
    await setNofile(denops, bufnr);
  }
  if (option?.nomodifiable) {
    await setNoModifiable(denops, bufnr);
  }
  if (option?.filetype) {
    await setFileType(denops, bufnr);
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
      await fn.execute(denops, "tabnew");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "main", bufnr, {
        nofile: true,
        nomodifiable: true,
      });
      await setCtx(denops, {
        instance: currentGitlaberInstance,
        nodes: nodes,
        parent_nodes: [],
        current_node: nodes[0],
      }, bufnr);
    },

    async openProjectIssuePanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const nodes = node.createProjectIssuePanelNodes();
      await fn.execute(denops, "botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "projectIssue", bufnr, {
        nofile: true,
        nomodifiable: true,
      });
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectIssuesPanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const { project, url, token } = ctx.instance;
      const projectIssues = await client.getProjectIssues(
        url,
        token,
        project.id,
      );
      const nodes = node.createProjectIssuesNodes(projectIssues);
      await fn.execute(denops, "vertical botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(
        denops,
        nodes,
        "projectIssues",
        bufnr,
        {
          nofile: true,
          nomodifiable: true,
        },
      );
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectBranchPanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const nodes = node.createProjectBranchPanelNodes();
      await fn.execute(denops, "botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "projectBranch", bufnr, {
        nofile: true,
        nomodifiable: true,
      });
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectBranchesPanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const { project, url, token } = ctx.instance;
      const projectBranches = await client.getProjectBranches(url, token, {
        id: project.id,
      });
      const nodes = node.createProjectBranchesNodes(projectBranches);
      await fn.execute(denops, "vertical botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(
        denops,
        nodes,
        "projectBranches",
        bufnr,
        {
          nofile: true,
          nomodifiable: true,
        },
      );
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectWikiPanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const nodes = node.createProjectWikiPanelNodes();
      await fn.execute(denops, "botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "projectWiki", bufnr, {
        nofile: true,
        nomodifiable: true,
      });
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectWikisPanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const { project, url, token } = ctx.instance;
      const projectWikis = await client.getProjectWikis(url, token, {
        id: project.id,
      });
      const nodes = node.createProjectWikiNodes(projectWikis);
      await fn.execute(denops, "vertical botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "projectWikis", bufnr, {
        nofile: true,
        nomodifiable: true,
      });
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectMergeRequestPanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const nodes = node.createProjectMergeRequestPanelNodes();
      await fn.execute(denops, "botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "projectMergeRequest", bufnr, {
        nofile: true,
        nomodifiable: true,
      });
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectMergeRequestsPanel(): Promise<void> {
      const ctx = await getCtx(denops);
      const { project, url, token } = ctx.instance;
      const projectMergeRequests = await client.getProjectMergeRequests(
        url,
        token,
        { id: project.id },
      );
      const nodes = node.createProjectMergeRequestsNodes(projectMergeRequests);
      await fn.execute(denops, "vertical botright new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(
        denops,
        nodes,
        "projectMergeRequests",
        bufnr,
        { nofile: true, nomodifiable: true },
      );
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openCreateNewProjectWikiBuf(): Promise<void> {
      const ctx = await getCtx(denops);
      const { project } = ctx.instance;
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
      await vars.b.set(denops, "gitlaber_project_id", project.id);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call gitlaber#denops#create_new_pro_wiki()",
        );
      });
      await keymap.setMapping(denops, "base");
      await setFileType(denops, bufnr);
      await denops.cmd("redraw");
      await setCtx(denops, {
        ...ctx,
      }, bufnr);
    },

    async openProjectWikiPreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node } = ctx;
      if (!("wiki" in current_node)) {
        return;
      }
      const nodes = node.createProjectWikiContentNodes(current_node.wiki);
      await fn.execute(denops, "new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "projectWiki", bufnr, {
        nofile: true,
        nomodifiable: true,
        filetype: "markdown",
      });
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openEditProjectWikiBuf(): Promise<void> {
      const ctx = await getCtx(denops);
      const { instance, current_node } = ctx;
      if (!("wiki" in current_node)) {
        return;
      }
      const nodes = node.createProjectWikiContentNodes(current_node.wiki);
      await fn.execute(denops, "new");
      const bufname = await fn.tempname(denops);
      const bufnr = await fn.bufadd(denops, bufname);
      await fn.bufload(denops, bufnr);
      await fn.execute(denops, `buffer ${bufnr}`);
      await setNodesOnBuf(denops, nodes, bufnr);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await vars.b.set(denops, "gitlaber_project_id", instance.project.id);
      await vars.b.set(denops, "gitlaber_wiki_title", current_node.wiki.title);
      await vars.b.set(denops, "gitlaber_wiki_slug", current_node.wiki.slug);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call gitlaber#denops#edit_wiki()",
        );
      });
      await keymap.setMapping(denops, "base");
      await setFileType(denops, bufnr);
      await denops.cmd("redraw");
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectIssuePreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node } = ctx;
      if (!("issue" in current_node)) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      if (current_node.issue.description == null) {
        helper.echo(denops, "This issue does not have a description.");
        return;
      }
      const nodes = node.createProjectIssueDescriptionNodes(current_node.issue);
      await fn.execute(denops, "new");
      const bufnr = await fn.bufnr(denops);
      await drawBuffer(denops, nodes, "projectIssue", bufnr, {
        nofile: true,
        nomodifiable: true,
        filetype: "markdown",
      });
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async openProjectIssueEditBuf(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!("issue" in current_node)) {
        return;
      }
      await fn.execute(denops, "new");
      const nodes = node.createProjectIssueDescriptionNodes(current_node.issue);
      const bufname = await fn.tempname(denops);
      const bufnr = await fn.bufadd(denops, bufname);
      await fn.bufload(denops, bufnr);
      await fn.execute(denops, `buffer ${bufnr}`);
      await setNodesOnBuf(denops, nodes, bufnr);
      await vars.b.set(denops, "gitlaber_nodes", nodes);
      await vars.b.set(denops, "gitlaber_project_id", instance.project.id);
      await vars.b.set(denops, "gitlaber_issue_iid", current_node.issue.iid);
      await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
        helper.remove("BufWritePost");
        helper.define(
          "BufWritePost",
          bufname,
          "call gitlaber#denops#edit_issue()",
        );
      });
      await keymap.setMapping(denops, "base");
      await setFileType(denops, bufnr);
      await denops.cmd("redraw");
      await setCtx(denops, {
        ...ctx,
        nodes: nodes,
      }, bufnr);
    },

    async reloadProjectIssues(bufnr: unknown): Promise<void> {
      if (!u.isNumber(bufnr)) {
        return;
      }
      await loadProjectIssues(denops, await getCtx(denops, bufnr), bufnr);
    },

    async reloadProjectWikis(bufnr: unknown): Promise<void> {
      if (!u.isNumber(bufnr)) {
        return;
      }
      await loadProjectWikis(denops, await getCtx(denops, bufnr), bufnr);
    },
  };
}

export const loadProjectIssues = async (
  denops: Denops,
  ctx: types.Ctx,
  bufnr: number,
) => {
  const { project, url, token } = ctx.instance;
  await setModifiable(denops, bufnr);
  const projectIssues = await client.getProjectIssues(url, token, project.id);
  const nodes = node.createProjectIssuesNodes(projectIssues);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await setNoModifiable(denops, bufnr);
  await setCtx(denops, {
    ...ctx,
    nodes: nodes,
  }, bufnr);
};

export const loadProjectWikis = async (
  denops: Denops,
  ctx: types.Ctx,
  bufnr: number,
) => {
  const { project, url, token } = ctx.instance;
  await setModifiable(denops, bufnr);
  const projectWikis = await client.getProjectWikis(url, token, {
    id: project.id,
  });
  const nodes = node.createProjectWikiNodes(projectWikis);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await setNoModifiable(denops, bufnr);
  await setCtx(denops, {
    ...ctx,
    nodes: nodes,
  }, bufnr);
};

export const loadProjectBranches = async (
  denops: Denops,
  ctx: types.Ctx,
  bufnr: number,
) => {
  const { project, url, token } = ctx.instance;
  await setModifiable(denops, bufnr);
  const projectBranches = await client.getProjectBranches(url, token, {
    id: project.id,
  });
  const nodes = node.createProjectBranchesNodes(projectBranches);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await setNoModifiable(denops, bufnr);
  await setCtx(denops, {
    ...ctx,
    nodes: nodes,
  }, bufnr);
};

export const loadProjectMergeRequests = async (
  denops: Denops,
  ctx: types.Ctx,
  bufnr: number,
) => {
  const { project, url, token } = ctx.instance;
  await setModifiable(denops, bufnr);
  const projectMergeRequests = await client.getProjectMergeRequests(
    url,
    token,
    { id: project.id },
  );
  const nodes = node.createProjectMergeRequestsNodes(projectMergeRequests);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await setNoModifiable(denops, bufnr);
};

export const setNodesOnBuf = async (
  denops: Denops,
  nodes: Array<types.Node>,
  bufnr: number,
) => {
  const bufLines = await fn.getbufline(
    denops,
    bufnr,
    1,
    "$",
  );
  if (bufLines.length > nodes.length) {
    await fn.deletebufline(
      denops,
      bufnr,
      nodes.length + 1,
      "$",
    );
  }
  for (let i = 0; i < nodes.length; i++) {
    await fn.setbufline(denops, bufnr, i + 1, nodes[i].display);
  }
};

export const setNofile = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&buftype",
    "nofile",
  );
};

export const setFileType = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&filetype",
    "markdown",
  );
};

export const setModifiable = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&modifiable",
    true,
  );
};

export const setNoModifiable = async (denops: Denops, bufnr: number) => {
  await fn.setbufvar(
    denops,
    bufnr,
    "&modifiable",
    false,
  );
};
