import { Denops, fn, unknownutil as u } from "../deps.ts";
import { getContext, getCurrentNode } from "../helper.ts";
import { ActionStore } from "./types.ts";
import { addInstance, checkInstanceExists } from "../helper.ts";
import {
  assignIssue,
  browseIssue,
  closeIssue,
  createIssue,
  deleteIssue,
  labelIssue,
  reopenIssue,
  unlabelIssue,
} from "./resource/issue.ts";
import { browseBranch, createBranch } from "./resource/branch.ts";
import { browseProject } from "./resource/project.ts";
import { browseWiki, deleteWiki } from "./resource/wiki.ts";
import {
  approveMergeRequest,
  assignAssigneeMergeRequest,
  assignReviewerMergeRequest,
  browseMergeRequest,
  closeMergeRequest,
  createMergeRequest,
  deleteMergeRequest,
  labelMergeRequest,
  mergeMergeRequest,
  reopenMergeRequest,
  unapproveMergeRequest,
  unlabelMergeRequest,
} from "./resource/mr.ts";
import {
  openBranchConfig,
  openBranchList,
  openIssueConfig,
  openIssueEdit,
  openIssueList,
  openIssuePreview,
  openMrConfig,
  openMrList,
  openProjectStatus,
  openWikiConfig,
  openWikiList,
} from "../buffer/main.ts";
import { echoNode } from "./common/main.ts";
import { getBufferParams } from "../buffer/helper.ts";
import { flattenBuffer } from "../util.ts";
import { editProjectIssue } from "../client/index.ts";
import { executeRequest } from "./resource/core.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    doAction: async (args: unknown) => {
      const actionName = u.ensure(args, u.isString);
      verifyActionName(actionName);
      const action = actionStore[actionName as keyof ActionStore];
      if (!await checkInstanceExists(denops)) {
        await addInstance(denops);
      }
      const ctx = await getContext(denops);
      const node = await getCurrentNode(denops);
      await action({ denops, ctx, node });
    },

    editIssue: async (args: unknown) => {
      const bufnr = u.ensure(args, u.isNumber);
      const params = u.ensure(
        await getBufferParams(denops, bufnr),
        u.isObjectOf({
          id: u.isNumber,
          issue_iid: u.isNumber,
        }),
      );
      const lines = await flattenBuffer(
        denops,
        await fn.bufname(denops, bufnr),
      );
      const ctx = await getContext(denops);
      await executeRequest(denops, editProjectIssue, ctx.url, ctx.token, {
        id: params.id,
        issue_iid: params.issue_iid,
        description: lines,
      }, "Successfully updated an issue.");
    },
  };
}

const actionStore: ActionStore = {
  "branch:browse": browseBranch,
  "branch:config": openBranchConfig,
  "branch:list": openBranchList,
  "branch:new": createBranch,
  "issue:assign": assignIssue,
  "issue:browse": browseIssue,
  "issue:close": closeIssue,
  "issue:config": openIssueConfig,
  "issue:delete": deleteIssue,
  "issue:label": labelIssue,
  "issue:list": openIssueList,
  "issue:new": createIssue,
  "issue:reopen": reopenIssue,
  "issue:unlabel": unlabelIssue,
  "issue:preview": openIssuePreview,
  "issue:edit": openIssueEdit,
  "mr:approve": approveMergeRequest,
  "mr:assign:assignee": assignAssigneeMergeRequest,
  "mr:assign:reviewer": assignReviewerMergeRequest,
  "mr:browse": browseMergeRequest,
  "mr:close": closeMergeRequest,
  "mr:config": openMrConfig,
  "mr:delete": deleteMergeRequest,
  "mr:label": labelMergeRequest,
  "mr:list": openMrList,
  "mr:merge": mergeMergeRequest,
  "mr:new": createMergeRequest,
  "mr:reopen": reopenMergeRequest,
  "mr:unapprove": unapproveMergeRequest,
  "mr:unlabel": unlabelMergeRequest,
  "project:browse": browseProject,
  "project:status": openProjectStatus,
  "wiki:browse": browseWiki,
  "wiki:config": openWikiConfig,
  "wiki:delete": deleteWiki,
  "wiki:list": openWikiList,
  "util:echo:node": echoNode,
};

function verifyActionName(actionName: string): void {
  if (!actionStore[actionName as keyof ActionStore]) {
    throw new Error(`Unknown action name: ${actionName}`);
  }
}
