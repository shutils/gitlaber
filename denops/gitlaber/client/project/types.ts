import { unknownutil as u } from "../../deps.ts";

export const isProjectId = u.isOneOf([u.isString, u.isNumber]);
export type ProjectId = u.PredicateType<typeof isProjectId>;

export const isProject = u.isObjectOf({
  id: isProjectId,
  description: u.isOneOf([u.isString, u.isNull]),
  web_url: u.isString,
  name: u.isString,
  path: u.isString,
  path_with_namespace: u.isString,
  open_issues_count: u.isNumber,
  created_at: u.isString,
  updated_at: u.isOptionalOf(u.isString),
  default_branch: u.isString,
  issue_branch_template: u.isOneOf([u.isString, u.isNull]),
  _links: u.isObjectOf({
    self: u.isString,
    issues: u.isString,
    merge_requests: u.isString,
    repo_branches: u.isString,
    labels: u.isString,
    events: u.isString,
    members: u.isString,
    cluster_agents: u.isString,
    ...u.isUnknown,
  }),
  ...u.isUnknown,
});

export type Project = u.PredicateType<typeof isProject>;
