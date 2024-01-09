export {
  type Branch,
  getProjectBranches,
  isBranch,
  requestCreateIssueBranch,
} from "./branch.ts";
export { requestGetCommit } from "./commit.ts";
export {
  getProjectIssues,
  isIssue,
  type Issue,
  requestCreateNewProjectIssue,
  requestDeleteIssue,
  requestEditIssue,
} from "./issue.ts";
export { requestCreateMergeRequest } from "./mr.ts";
export { getSingleProject, isProject, type Project } from "./project.ts";
export {
  getProjectWikis,
  isWiki,
  requestCreateNewProjectWiki,
  requestDeleteWiki,
  requestEditWiki,
  type Wiki,
} from "./wiki.ts";

export { getGitlabToken, getGitlabUrl } from "./util.ts";
