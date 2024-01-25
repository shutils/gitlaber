import { Denops, unknownutil as u } from "../deps.ts";
import { getContext, getCurrentNode } from "../helper.ts";
import { ActionStore } from "./types.ts";
import { addInstance, checkInstanceExists } from "../helper.ts";
import {
  assignIssue,
  browseIssue,
  closeIssue,
  createIssue,
  deleteIssue,
  editIssueDescription,
  labelIssue,
  reopenIssue,
  unlabelIssue,
} from "./resource/issue.ts";
import { browseBranch, createBranch } from "./resource/branch.ts";
import { browseProject } from "./resource/project.ts";
import {
  browseWiki,
  createWiki,
  deleteWiki,
  editWikiContent,
} from "./resource/wiki.ts";
import {
  approveMergeRequest,
  assignAssigneeMergeRequest,
  assignReviewerMergeRequest,
  browseMergeRequest,
  closeMergeRequest,
  createMergeRequest,
  deleteMergeRequest,
  editMergeRequestDescription,
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
  openMrEdit,
  openMrList,
  openMrPreview,
  openProjectStatus,
  openWikiConfig,
  openWikiEdit,
  openWikiList,
  openWikiNew,
  openWikiPreview,
} from "../buffer/main.ts";
import { echoNode } from "./common/main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    doAction: async (args: unknown) => {
      const ensuredArgs = u.ensure(
        args,
        u.isObjectOf({
          name: u.isString,
          params: u.isOptionalOf(u.isRecord),
        }),
      );
      const name = ensuredArgs.name;
      const params = ensuredArgs.params;
      verifyActionName(name);
      const action = actionStore[name as keyof ActionStore];
      if (!await checkInstanceExists(denops)) {
        await addInstance(denops);
      }
      const ctx = await getContext(denops);
      const node = await getCurrentNode(denops);
      await action({ denops, ctx, node, params });
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
  "issue:_edit": editIssueDescription,
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
  "mr:preview": openMrPreview,
  "mr:edit": openMrEdit,
  "mr:_edit": editMergeRequestDescription,
  "project:browse": browseProject,
  "project:status": openProjectStatus,
  "wiki:browse": browseWiki,
  "wiki:config": openWikiConfig,
  "wiki:delete": deleteWiki,
  "wiki:list": openWikiList,
  "wiki:new": openWikiNew,
  "wiki:_new": createWiki,
  "wiki:edit": openWikiEdit,
  "wiki:_edit": editWikiContent,
  "wiki:preview": openWikiPreview,
  "util:echo:node": echoNode,
};

function verifyActionName(actionName: string): void {
  if (!actionStore[actionName as keyof ActionStore]) {
    throw new Error(`Unknown action name: ${actionName}`);
  }
}
