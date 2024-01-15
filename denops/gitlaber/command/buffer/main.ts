import {
  autocmd,
  Denops,
  fn,
  helper,
  unknownutil as u,
  vars,
} from "../../deps.ts";

import * as node from "../../node.ts";
import * as types from "../../types.ts";
import * as keymap from "../../keymap.ts";
import * as client from "../../client/index.ts";
import {
  getCtx,
  getCurrentGitlaberInstance,
  getGitlaberVar,
  setCtx,
  setGitlaberVar,
} from "../../core.ts";

async function setBufferInfo(
  denops: Denops,
  bufferInfo: types.BufferInfo,
  bufnr?: number,
) {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  await fn.setbufvar(denops, bufnr, "gitlaber_buffer_info", bufferInfo);
}

export async function getBufferInfo(
  denops: Denops,
  bufnr?: number,
): Promise<types.BufferInfo> {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  const bufferInfo = await fn.getbufvar(denops, bufnr, "gitlaber_buffer_info");
  if (
    u.isObjectOf({
      buffer_kind: u.isString,
      ...u.isUnknown,
    })
  ) {
    return (bufferInfo as types.BufferInfo);
  } else {
    throw new Error("buffer info is not set");
  }
}

function selectBufferInfo(kind: types.BufferKind): types.BufferInfo {
  const bufferInfos: types.BufferInfo[] = [
    {
      buffer_kind: "project_issue",
      resource_kind: "other",
      config: {
        direction: "botright new",
        node_creater: node.createProjectIssuePanelNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
    {
      buffer_kind: "project_issues",
      resource_kind: "issue",
      config: {
        direction: "vertical botright new",
        node_creater: node.createProjectIssuesNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
    {
      buffer_kind: "project_branch",
      resource_kind: "other",
      config: {
        direction: "botright new",
        node_creater: node.createProjectBranchPanelNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
    {
      buffer_kind: "project_branches",
      resource_kind: "branch",
      config: {
        direction: "botright new",
        node_creater: node.createProjectBranchesNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
    {
      buffer_kind: "project_wiki",
      resource_kind: "other",
      config: {
        direction: "botright new",
        node_creater: node.createProjectWikiPanelNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
    {
      buffer_kind: "project_wikis",
      resource_kind: "wiki",
      config: {
        direction: "vertical botright new",
        node_creater: node.createProjectWikiNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
    {
      buffer_kind: "project_merge_request",
      resource_kind: "other",
      config: {
        direction: "botright new",
        node_creater: node.createProjectMergeRequestPanelNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
    {
      buffer_kind: "project_merge_requests",
      resource_kind: "merge_request",
      config: {
        direction: "vertical botright new",
        node_creater: node.createProjectMergeRequestsNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
    },
  ];
  const bufferInfo = bufferInfos.find((buffer) => buffer.buffer_kind === kind);
  if (!bufferInfo) {
    throw new Error("Cannot find buffer info for specified kind");
  }
  return bufferInfo;
}

async function renderBuffer(denops: Denops, bufferInfo: types.BufferInfo) {
  const gitlaberVar = await getGitlaberVar(denops);
  const ctx = await getCtx(denops);
  const config = bufferInfo.config;

  const nodes = await config.node_creater(denops, ctx);
  await fn.execute(denops, config.direction);
  const bufnr = await fn.bufnr(denops);
  await drawBuffer(
    denops,
    nodes,
    bufferInfo.buffer_kind,
    bufnr,
    config.options,
  );
  await setCtx(denops, {
    ...ctx,
    nodes: nodes,
  }, bufnr);
  await setBufferInfo(denops, bufferInfo);
  const instance = await getCurrentGitlaberInstance(denops);
  instance.buffers.push({
    resource_kind: bufferInfo.resource_kind,
    bufnr: bufnr,
  });
  gitlaberVar.instances[gitlaberVar.recent_instance_index] = instance;
  await setGitlaberVar(denops, {
    ...gitlaberVar,
    recent_instance_index: gitlaberVar.instances.findIndex((instance) =>
      instance.cwd === ctx.instance.cwd
    ),
  });
}

async function reRenderBuffer(
  denops: Denops,
  bufnr?: number,
) {
  if (!bufnr) {
    bufnr = await fn.bufnr(denops);
  }
  const bufferInfo = await getBufferInfo(denops, bufnr);
  const ctx = await getCtx(denops);
  const config = selectBufferInfo(bufferInfo.buffer_kind).config;

  const nodes = await config.node_creater(denops, ctx);
  await drawBuffer(
    denops,
    nodes,
    bufferInfo.buffer_kind,
    bufnr,
    config.options,
  );
  await setCtx(denops, {
    ...ctx,
    nodes: nodes,
  }, bufnr);
}

async function drawBuffer(
  denops: Denops,
  nodes: types.Node[],
  kind: types.BufferKind,
  bufnr: number,
  option?: types.BufferOptions,
) {
  await setModifiable(denops, bufnr);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  await keymap.setMapping(denops, kind);
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
      const gitlaberVar = await getGitlaberVar(denops);
      await fn.execute(denops, "tabnew");
      const bufnr = await fn.bufnr(denops);
      try {
        await getCurrentGitlaberInstance(denops);
      } catch {
        const currentGitlaberInstance: types.GitlaberInstance = {
          cwd: cwd,
          project: singleProject,
          url: url,
          token: token,
          buffers: [{ resource_kind: "other", bufnr: bufnr }],
        };
        gitlaberVar.instances.push(currentGitlaberInstance);
        await setGitlaberVar(denops, gitlaberVar);
      }
      const currentGitlaberInstance = await getCurrentGitlaberInstance(
        denops,
      );
      const nodes = node.createMainPanelNodes(
        currentGitlaberInstance,
        singleProject,
      );
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
      await renderBuffer(denops, selectBufferInfo("project_issue"));
    },

    async openProjectIssuesPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_issues"));
    },

    async openProjectBranchPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_branch"));
    },

    async openProjectBranchesPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_branches"));
    },

    async openProjectWikiPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_wiki"));
    },

    async openProjectWikisPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_wikis"));
    },

    async openProjectMergeRequestPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_merge_request"));
    },

    async openProjectMergeRequestsPanel(): Promise<void> {
      await renderBuffer(denops, selectBufferInfo("project_merge_requests"));
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
      await drawBuffer(denops, nodes, "project_wiki", bufnr, {
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
      await drawBuffer(denops, nodes, "project_issue", bufnr, {
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

    async reloadBuffer(bufnr: unknown): Promise<void> {
      if (!u.isNumber(bufnr)) {
        return;
      }
      await reRenderBuffer(denops, bufnr);
    },

    async updateResourceBuffer(): Promise<void> {
      const gitlaberVar = await getGitlaberVar(denops);
      const recentInstance = gitlaberVar.recent_instance_index;
      const instance = gitlaberVar.instances[recentInstance];
      const recentResource = instance.recent_resource;
      const targetBuffers = instance.buffers.filter((buffer) =>
        buffer.resource_kind === recentResource
      );
      targetBuffers.forEach(async (buffer) => {
        await reRenderBuffer(denops, buffer.bufnr);
      });
    },
  };
}

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
