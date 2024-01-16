import {
  autocmd,
  Denops,
  fn,
  helper,
  mapping,
  unknownutil as u,
  vars,
} from "../../deps.ts";

import * as types from "../../types.ts";
import * as client from "../../client/index.ts";
import {
  getCtx,
  getCurrentGitlaberInstance,
  getCurrentNode,
  getGitlaberVar,
  setCtx,
  setGitlaberVar,
} from "../../core.ts";
import { selectBufferInfo } from "./config.ts";

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
async function renderBuffer(
  denops: Denops,
  bufferInfo: types.BufferInfo,
) {
  const gitlaberVar = await getGitlaberVar(denops);
  const ctx = await getCtx(denops);
  const config = bufferInfo.config;

  const nodes = await config.node_creater(denops, ctx);
  await fn.execute(denops, config.direction);
  let bufnr: number;
  if (config.tmp) {
    const bufname = await fn.tempname(denops);
    bufnr = await fn.bufadd(denops, bufname);
    await fn.bufload(denops, bufnr);
    await fn.execute(denops, `buffer ${bufnr}`);
    if (bufferInfo.autocmd) {
      await bufferInfo.autocmd({
        bufname: bufname,
      });
    }
  } else {
    bufnr = await fn.bufnr(denops);
  }
  await drawBuffer(
    denops,
    nodes,
    bufnr,
    bufferInfo.keymaps,
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
    bufnr,
    bufferInfo.keymaps,
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
  bufnr: number,
  keymaps: types.Mapping[],
  option?: types.BufferOptions,
) {
  await setModifiable(denops, bufnr);
  await setNodesOnBuf(denops, nodes, bufnr);
  await vars.b.set(denops, "gitlaber_nodes", nodes);
  keymaps.map(async (keymap) => {
    await mapping.map(denops, keymap.lhs, keymap.rhs, keymap.option);
  });
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
      await setCtx(denops, {
        instance: await getCurrentGitlaberInstance(denops),
        nodes: [],
      }, bufnr);
      await renderBuffer(denops, selectBufferInfo("main"));
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
      const title = await helper.input(denops, {
        prompt: "New wiki title: ",
      });
      if (!title) {
        return;
      }
      const bufinfo = selectBufferInfo("wiki_create");
      bufinfo.autocmd = async (params) => {
        const bufname = params?.bufname;
        if (!bufname) {
          helper.echoerr(denops, "bufname is not set");
          return;
        }
        if (!u.isString(bufname)) {
          helper.echoerr(denops, "bufname is not string");
          return;
        }
        await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
          helper.remove("BufWritePost");
          helper.define(
            "BufWritePost",
            bufname,
            "call denops#notify('gitlaber', 'action:resource:wiki:_new', [])",
          );
        });
      };
      bufinfo.params = {
        user_input: {
          title: title,
        },
      };
      await renderBuffer(denops, bufinfo);
    },

    async openProjectWikiPreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isWiki(currentNode.resource))) {
        helper.echo(denops, "This node is not a wiki.");
        return;
      }
      await renderBuffer(denops, selectBufferInfo("wiki_preview"));
    },

    async openEditProjectWikiBuf(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isWiki(currentNode.resource))) {
        helper.echo(denops, "This node is not a wiki.");
        return;
      }
      const title = currentNode.resource.title;
      const slug = currentNode.resource.slug;
      const bufinfo = selectBufferInfo("wiki_edit");
      bufinfo.autocmd = async (params) => {
        const bufname = params?.bufname;
        if (!bufname) {
          helper.echoerr(denops, "bufname is not set");
          return;
        }
        if (!u.isString(bufname)) {
          helper.echoerr(denops, "bufname is not string");
          return;
        }
        await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
          helper.remove("BufWritePost");
          helper.define(
            "BufWritePost",
            bufname,
            "call denops#notify('gitlaber', 'action:resource:wiki:_edit', [])",
          );
        });
      };
      bufinfo.params = {
        user_input: {
          title: title,
          slug: slug,
        },
      };
      await renderBuffer(denops, bufinfo);
    },

    async openProjectIssuePreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isIssue(currentNode.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      if (currentNode.resource.description == null) {
        helper.echo(denops, "This issue does not have a description.");
        return;
      }
      await renderBuffer(denops, selectBufferInfo("issue_preview"));
    },

    async openProjectIssueEditBuf(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isIssue(currentNode.resource))) {
        helper.echo(denops, "This node is not an issue.");
        return;
      }
      const iid = currentNode.resource.iid;
      const bufinfo = selectBufferInfo("issue_edit");
      bufinfo.autocmd = async (params) => {
        const bufname = params?.bufname;
        if (!bufname) {
          helper.echoerr(denops, "bufname is not set");
          return;
        }
        if (!u.isString(bufname)) {
          helper.echoerr(denops, "bufname is not string");
          return;
        }
        await autocmd.group(denops, "gitlaber_autocmd", (helper) => {
          helper.remove("BufWritePost");
          helper.define(
            "BufWritePost",
            bufname,
            "call denops#notify('gitlaber', 'action:resource:issue:_edit', [])",
          );
        });
      };
      bufinfo.params = {
        user_input: {
          iid: iid,
        },
      };
      await renderBuffer(denops, bufinfo);
    },

    async openProjectMergeRequestPreview(): Promise<void> {
      const ctx = await getCtx(denops);
      const currentNode = await getCurrentNode(denops, ctx);
      if (!(client.isMergeRequest(currentNode.resource))) {
        helper.echo(denops, "This node is not a merge request.");
        return;
      }
      if (currentNode.resource.description == null) {
        helper.echo(denops, "This merge request does not have a description.");
        return;
      }
      await renderBuffer(denops, selectBufferInfo("merge_request_preview"));
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
      if (!recentResource) {
        return;
      }
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
