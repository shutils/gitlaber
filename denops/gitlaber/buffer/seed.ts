import { unknownutil as u } from "../deps.ts";
import { isProjectId } from "../types.ts";

export const isUrl = u.isString;
export const isToken = u.isString;

export const isIssueListSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
});
export type IssueListSeed = u.PredicateType<typeof isIssueListSeed>;

export const isWikiListSeed = isIssueListSeed;
export type WikiListSeed = u.PredicateType<typeof isWikiListSeed>;
export const isBranchListSeed = isIssueListSeed;
export type BranchListSeed = u.PredicateType<typeof isBranchListSeed>;
export const isJobListSeed = isIssueListSeed;
export type JobListSeed = u.PredicateType<typeof isJobListSeed>;

export const isMrListSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  path_with_namespace: u.isString,
});
export type MrListSeed = u.PredicateType<typeof isMrListSeed>;

export const isIssuePreviewSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  issue_iid: u.isNumber,
});
export type IssuePreviewSeed = u.PredicateType<typeof isIssuePreviewSeed>;

export const isIssueEditSeed = isIssuePreviewSeed;
export type IssueEditSeed = u.PredicateType<typeof isIssueEditSeed>;

export const isMrPreviewSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  merge_request_iid: u.isNumber,
});
export type MrPreviewSeed = u.PredicateType<typeof isMrPreviewSeed>;

export const isMrEditSeed = isMrPreviewSeed;
export type MrEditSeed = u.PredicateType<typeof isMrEditSeed>;

export const isWikiPreviewSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  slug: u.isString,
});
export type WikiPreviewSeed = u.PredicateType<typeof isWikiPreviewSeed>;

export const isWikiEditSeed = isWikiPreviewSeed;
export type WikiEditSeed = u.PredicateType<typeof isWikiEditSeed>;

export const isMrChangeListSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  merge_request_iid: u.isNumber,
});
export type MrChangeListSeed = u.PredicateType<typeof isMrChangeListSeed>;

export const isMrFileWithDiscussionSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  merge_request_iid: u.isNumber,
  file_path: u.isString,
  ref: u.isString,
  kind: u.isLiteralOneOf(["old", "new"] as const),
});
export type MrFileWithDiscussionSeed = u.PredicateType<
  typeof isMrFileWithDiscussionSeed
>;

export const isMrDiscussionSeed = isMrChangeListSeed;
export type MrDiscussionSeed = u.PredicateType<
  typeof isMrDiscussionSeed
>;

export const isMrDiscussionInspectSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  merge_request_iid: u.isNumber,
  discussion_id: u.isString,
});
export type MrDiscussionInspectSeed = u.PredicateType<
  typeof isMrDiscussionInspectSeed
>;

export const isJobLogSeed = u.isObjectOf({
  url: isUrl,
  token: isToken,
  id: isProjectId,
  job_id: u.isNumber,
});

export type JobLogSeed = u.PredicateType<typeof isJobLogSeed>;
