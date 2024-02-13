import { Denops, unknownutil as u } from "../deps.ts";
import { getContext, getCurrentNode } from "../helper.ts";
import { ActionStore, isActionName } from "./types.ts";
import { addInstance, checkInstanceExists } from "../helper.ts";
import {
  assignIssue,
  browseIssue,
  closeIssue,
  createIssue,
  deleteIssue,
  editIssueDescription,
  labelIssue,
  openIssueConfig,
  openIssueEdit,
  openIssueList,
  openIssuePreview,
  reopenIssue,
  unlabelIssue,
} from "./resource/issue.ts";
import {
  browseBranch,
  createBranch,
  openBranchConfig,
  openBranchList,
} from "./resource/branch.ts";
import { browseProject, openProjectStatus } from "./resource/project.ts";
import {
  browseWiki,
  createWiki,
  deleteWiki,
  editWikiContent,
  openWikiConfig,
  openWikiEdit,
  openWikiList,
  openWikiNew,
  openWikiPreview,
} from "./resource/wiki.ts";
import {
  addMrDiscussionComment,
  approveMergeRequest,
  assignAssigneeMergeRequest,
  assignReviewerMergeRequest,
  browseMergeRequest,
  closeMergeRequest,
  createMergeRequest,
  createMrDiscussion,
  createMrDiscussionOverview,
  deleteMergeRequest,
  editMergeRequestDescription,
  inspectMrDiscussion,
  labelMergeRequest,
  mergeMergeRequest,
  openMrChangeDiff,
  openMrChangeList,
  openMrConfig,
  openMrDiscussion,
  openMrEdit,
  openMrList,
  openMrPreview,
  reopenMergeRequest,
  resolveMrDiscussion,
  toggleMrDiscussion,
  unapproveMergeRequest,
  unlabelMergeRequest,
} from "./resource/mr.ts";
import { nextList, previousList } from "./resource/common.ts";
import {
  browseJob,
  openJobList,
  openJobListForPipeline,
  openJobLog,
} from "./resource/job.ts";
import { brwosePipeline, openPipelineList } from "./resource/pipeline.ts";
import {
  closeAllBuffer,
  closeBuffer,
  echoKeymaps,
  echoNode,
  hideBuffer,
  openMergedYaml,
  reloadBuffer,
} from "./common/main.ts";
import { uiInput, uiSelect } from "./ui/main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    doAction: async (args: unknown) => {
      const ensuredArgs = u.ensure(
        args,
        u.isObjectOf({
          name: isActionName,
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
      await action({ denops, ctx, node, params, name });
    },
  };
}

const actionStore: ActionStore = {
  "branch-browse": browseBranch,
  "branch-config": openBranchConfig,
  "branch-list": openBranchList,
  "branch-new": createBranch,
  "branch-list-next": nextList,
  "branch-list-prev": previousList,
  "issue-assign": assignIssue,
  "issue-browse": browseIssue,
  "issue-close": closeIssue,
  "issue-config": openIssueConfig,
  "issue-delete": deleteIssue,
  "issue-label": labelIssue,
  "issue-list": openIssueList,
  "issue-list-next": nextList,
  "issue-list-prev": previousList,
  "issue-new": createIssue,
  "issue-reopen": reopenIssue,
  "issue-unlabel": unlabelIssue,
  "issue-preview": openIssuePreview,
  "issue-edit": openIssueEdit,
  "issue-edit-submit": editIssueDescription,
  "mr-approve": approveMergeRequest,
  "mr-assign-assignee": assignAssigneeMergeRequest,
  "mr-assign-reviewer": assignReviewerMergeRequest,
  "mr-browse": browseMergeRequest,
  "mr-close": closeMergeRequest,
  "mr-config": openMrConfig,
  "mr-delete": deleteMergeRequest,
  "mr-edit": openMrEdit,
  "mr-edit-submit": editMergeRequestDescription,
  "mr-label": labelMergeRequest,
  "mr-list": openMrList,
  "mr-merge": mergeMergeRequest,
  "mr-new": createMergeRequest,
  "mr-preview": openMrPreview,
  "mr-reopen": reopenMergeRequest,
  "mr-unapprove": unapproveMergeRequest,
  "mr-unlabel": unlabelMergeRequest,
  "mr-change-list": openMrChangeList,
  "mr-change-diff": openMrChangeDiff,
  "mr-discussion-new": createMrDiscussion,
  "mr-discussion-new-overview": createMrDiscussionOverview,
  "mr-discussion-inspect": inspectMrDiscussion,
  "mr-discussion-add-note": addMrDiscussionComment,
  "mr-discussion-resolve": resolveMrDiscussion,
  "mr-discussion-open": openMrDiscussion,
  "mr-discussion-toggle": toggleMrDiscussion,
  "project-browse": browseProject,
  "project-status": openProjectStatus,
  "pipeline-list": openPipelineList,
  "pipeline-browse": brwosePipeline,
  "wiki-browse": browseWiki,
  "wiki-config": openWikiConfig,
  "wiki-delete": deleteWiki,
  "wiki-list": openWikiList,
  "wiki-new": openWikiNew,
  "wiki-new-submit": createWiki,
  "wiki-edit": openWikiEdit,
  "wiki-edit-submit": editWikiContent,
  "wiki-preview": openWikiPreview,
  "job-list": openJobList,
  "job-browse": browseJob,
  "job-list-for-pipeline": openJobListForPipeline,
  "job-log": openJobLog,
  "util-echo-node": echoNode,
  "util-echo-keymaps": echoKeymaps,
  "ui-select": uiSelect,
  "ui-input": uiInput,
  "ci-lint": openMergedYaml,
  "buffer-close": closeBuffer,
  "buffer-hide": hideBuffer,
  "buffer-close-all": closeAllBuffer,
  "buffer-reload": reloadBuffer,
};

function verifyActionName(actionName: string): void {
  if (!actionStore[actionName as keyof ActionStore]) {
    throw new Error(`Unknown action name: ${actionName}`);
  }
}
