import {
  autocmd,
  Denops,
  fn,
  helper,
  mapping,
  unknownutil as u,
  vars,
} from "../../deps.ts";

import * as node from "../../node.ts";
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

const mapOption: mapping.MapOptions = {
  mode: "n",
  noremap: true,
  silent: true,
  buffer: true,
};

const baseMappings = [
  {
    lhs: "q",
    rhs: "<Cmd>bd!<CR>",
    option: mapOption,
    description: "Close buffer",
  },
  {
    lhs: "I",
    rhs: "<Cmd>echo gitlaber#denops#get_current_node()<CR>",
    option: mapOption,
    description: "Show current node",
  },
  {
    lhs: "g?",
    rhs: "<Cmd>call denops#notify('gitlaber', 'echoKeymaps', [])<CR>",
    option: mapOption,
    description: "Show keymaps",
  },
];

function selectBufferInfo(kind: types.BufferKind): types.BufferInfo {
  const bufferInfos: types.BufferInfo[] = [
    {
      buffer_kind: "main",
      resource_kind: "other",
      config: {
        direction: "tabnew",
        node_creater: node.createMainPanelNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
      keymaps: [
        ...baseMappings,
        {
          lhs: "o",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'openBrowserProject', [])<CR>",
          option: mapOption,
          description: "Open project in browser",
        },
        {
          lhs: "i",
          rhs: "<Cmd>call gitlaber#denops#open_issue_panel()<CR>",
          option: mapOption,
          description: "Open issue panel",
        },
        {
          lhs: "w",
          rhs: "<Cmd>call gitlaber#denops#open_wiki_panel()<CR>",
          option: mapOption,
          description: "Open wiki panel",
        },
        {
          lhs: "b",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'openProjectBranchPanel', [])<CR>",
          option: mapOption,
          description: "Open branch panel",
        },
        {
          lhs: "m",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestPanel', [])<CR>",
          option: mapOption,
          description: "Open merge request panel",
        },
      ],
    },
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
      keymaps: [
        ...baseMappings,
        {
          lhs: "l",
          rhs: "<Cmd>call gitlaber#denops#open_issues_panel()<CR>",
          option: mapOption,
          description: "Open issues panel",
        },
        {
          lhs: "n",
          rhs: "<Cmd>call gitlaber#denops#create_new_pro_issue()<CR>",
          option: mapOption,
          description: "Create new issue",
        },
      ],
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
      keymaps: [
        ...baseMappings,
        {
          lhs: "d",
          rhs: "<Cmd>call gitlaber#denops#delete_pro_issue()<CR>",
          option: mapOption,
          description: "Delete issue",
        },
        {
          lhs: "R",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'reloadBuffer', [bufnr()])<CR>",
          option: mapOption,
          description: "Reload issues",
        },
        {
          lhs: "p",
          rhs: "<Cmd>call gitlaber#denops#open_pro_issue_preview()<CR>",
          option: mapOption,
          description: "Open issue preview",
        },
        {
          lhs: "e",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'openProjectIssueEditBuf', [])<CR>",
          option: mapOption,
          description: "Open issue edit",
        },
        {
          lhs: "b",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'createIssueBranch', [])<CR>",
          option: mapOption,
          description: "Create issue branch",
        },
        {
          lhs: "t",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'toggleProjectIssueState', [])<CR>",
          option: mapOption,
          description: "Toggle issue state",
        },
        {
          lhs: "o",
          rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
          option: mapOption,
          description: "Open issue in browser",
        },
        {
          lhs: "la",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'addProjectIssueLabel', [])<CR>",
          option: mapOption,
          description: "Add issue label",
        },
        {
          lhs: "lr",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'removeProjectIssueLabel', [])<CR>",
          option: mapOption,
          description: "Remove issue label",
        },
        {
          lhs: "a",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'assignIssueAssignee', [])<CR>",
          option: mapOption,
          description: "Assign issue assignee",
        },
      ],
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
      keymaps: [
        ...baseMappings,
        {
          lhs: "l",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'openProjectBranchesPanel', [])<CR>",
          option: mapOption,
          description: "Open branches panel",
        },
      ],
    },
    {
      buffer_kind: "project_branches",
      resource_kind: "branch",
      config: {
        direction: "vertical botright new",
        node_creater: node.createProjectBranchesNodes,
        options: {
          nofile: true,
          nomodifiable: true,
        },
      },
      keymaps: [
        ...baseMappings,
        {
          lhs: "M",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'createNewBranchMr', [])<CR>",
          option: mapOption,
          description: "Create new branch merge request",
        },
        {
          lhs: "o",
          rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
          option: mapOption,
          description: "Open branch in browser",
        },
      ],
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
      keymaps: [
        ...baseMappings,
        {
          lhs: "l",
          rhs: "<Cmd>call gitlaber#denops#open_wikis_panel()<CR>",
          option: mapOption,
          description: "Open wikis panel",
        },
        {
          lhs: "n",
          rhs: "<Cmd>call gitlaber#denops#open_create_new_pro_wiki_buf()<CR>",
          option: mapOption,
          description: "Create new wiki",
        },
      ],
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
      keymaps: [
        ...baseMappings,
        {
          lhs: "d",
          rhs: "<Cmd>call gitlaber#denops#delete_pro_wiki()<CR>",
          option: mapOption,
          description: "Delete wiki",
        },
        {
          lhs: "R",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'reloadBuffer', [bufnr()])<CR>",
          option: mapOption,
          description: "Reload wikis",
        },
        {
          lhs: "p",
          rhs: "<Cmd>call gitlaber#denops#open_pro_wiki_preview()<CR>",
          option: mapOption,
          description: "Open wiki preview",
        },
        {
          lhs: "e",
          rhs: "<Cmd>call gitlaber#denops#open_edit_pro_wiki_buf()<CR>",
          option: mapOption,
          description: "Open wiki edit",
        },
        {
          lhs: "o",
          rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
          option: mapOption,
          description: "Open wiki in browser",
        },
      ],
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
      keymaps: [
        ...baseMappings,
        {
          lhs: "l",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestsPanel', [])<CR>",
          option: mapOption,
          description: "Open merge requests panel",
        },
      ],
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
      keymaps: [
        ...baseMappings,
        {
          lhs: "o",
          rhs: "<Cmd>call denops#notify('gitlaber', 'openBrowserNode', [])<CR>",
          option: mapOption,
          description: "Open merge request in browser",
        },
        {
          lhs: "a",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'assignMergeRequestAssignee', [])<CR>",
          option: mapOption,
          description: "Assign merge request assignee",
        },
        {
          lhs: "r",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'assignMergeRequestReviewer', [])<CR>",
          option: mapOption,
          description: "Assign merge request reviewer",
        },
        {
          lhs: "A",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'approveMergeRequest', [])<CR>",
          option: mapOption,
          description: "Approve a merge request",
        },
        {
          lhs: "M",
          rhs: "<Cmd>call denops#notify('gitlaber', '', [])<CR>",
          option: mapOption,
          description: "Merge a merge request",
        },
        {
          lhs: "p",
          rhs:
            "<Cmd>call denops#notify('gitlaber', 'openProjectMergeRequestPreview', [])<CR>",
          option: mapOption,
          description: "Open a merge request preview",
        },
      ],
    },
    {
      buffer_kind: "issue_preview",
      resource_kind: "other",
      config: {
        direction: "new",
        node_creater: node.createPreviewNodes,
        options: {
          nofile: true,
          nomodifiable: true,
          filetype: "markdown",
        },
      },
      keymaps: [
        ...baseMappings,
      ],
    },
    {
      buffer_kind: "issue_edit",
      resource_kind: "other",
      config: {
        direction: "new",
        node_creater: node.createPreviewNodes,
        options: {
          nofile: false,
          nomodifiable: false,
          filetype: "markdown",
        },
        tmp: true,
      },
      keymaps: [
        ...baseMappings,
      ],
    },
    {
      buffer_kind: "merge_request_preview",
      resource_kind: "other",
      config: {
        direction: "new",
        node_creater: node.createPreviewNodes,
        options: {
          nofile: true,
          nomodifiable: true,
          filetype: "markdown",
        },
      },
      keymaps: [
        ...baseMappings,
      ],
    },
    {
      buffer_kind: "wiki_create",
      resource_kind: "other",
      config: {
        direction: "vertical botright new",
        node_creater: (_denops, _ctx) => Promise.resolve([]),
        options: {
          nofile: false,
          nomodifiable: false,
          filetype: "markdown",
        },
        tmp: true,
      },
      keymaps: [
        ...baseMappings,
      ],
    },
    {
      buffer_kind: "wiki_edit",
      resource_kind: "other",
      config: {
        direction: "new",
        node_creater: node.createProjectWikiContentNodes,
        options: {
          nofile: false,
          nomodifiable: false,
          filetype: "markdown",
        },
        tmp: true,
      },
      keymaps: [
        ...baseMappings,
      ],
    },
    {
      buffer_kind: "wiki_preview",
      resource_kind: "other",
      config: {
        direction: "new",
        node_creater: node.createProjectWikiContentNodes,
        options: {
          nofile: true,
          nomodifiable: true,
          filetype: "markdown",
        },
      },
      keymaps: [
        ...baseMappings,
      ],
    },
  ];
  const bufferInfo = bufferInfos.find((buffer) => buffer.buffer_kind === kind);
  if (!bufferInfo) {
    throw new Error(
      `Cannot find buffer info for specified kind. kind: ${kind}`,
    );
  }
  return bufferInfo;
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
            "call gitlaber#denops#create_new_pro_wiki()",
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
            "call gitlaber#denops#edit_wiki()",
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
            "call gitlaber#denops#edit_issue()",
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
