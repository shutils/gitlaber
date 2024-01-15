import { unknownutil as u } from "../deps.ts";
import { request } from "./util.ts";

const isMergeRequestCreateAttributes = u.isObjectOf({
  id: u.isNumber,
  source_branch: u.isString,
  target_branch: u.isString,
  title: u.isString,
  description: u.isOptionalOf(u.isString),
  assignee_id: u.isOptionalOf(u.isNumber),
  remove_source_branch: u.isOptionalOf(u.isBoolean),
  squash: u.isOptionalOf(u.isBoolean),
  ...u.isUnknown,
});

export type MergeRequestCreateAttributes = u.PredicateType<
  typeof isMergeRequestCreateAttributes
>;

const isMergeRequestGetAttributes = u.isObjectOf({
  id: u.isNumber,
  approved: u.isOptionalOf(u.isLiteralOneOf(["yes", "no"] as const)),
  assignee_id: u.isOptionalOf(u.isNumber),
  author_id: u.isOptionalOf(u.isNumber),
  author_username: u.isOptionalOf(u.isString),
  labels: u.isOptionalOf(u.isString),
  ...u.isUnknown,
});

export type MergeRequestGetAttributes = u.PredicateType<
  typeof isMergeRequestGetAttributes
>;

const isMergeRequestEditAttributes = u.isObjectOf({
  id: u.isNumber,
  merge_request_iid: u.isNumber,
  add_labels: u.isOptionalOf(u.isString),
  assignee_id: u.isOptionalOf(u.isNumber),
  assignee_ids: u.isOptionalOf(u.isArrayOf(u.isNumber)),
  description: u.isOptionalOf(u.isString),
  labels: u.isOptionalOf(u.isString),
  remove_labels: u.isOptionalOf(u.isString),
  remove_source_branch: u.isOptionalOf(u.isBoolean),
  reviewer_ids: u.isOptionalOf(u.isArrayOf(u.isNumber)),
  squash: u.isOptionalOf(u.isBoolean),
  state_event: u.isOptionalOf(u.isLiteralOneOf(["close", "reopen"] as const)),
  target_branch: u.isOptionalOf(u.isString),
  title: u.isOptionalOf(u.isString),
  ...u.isUnknown,
});

export type MergeRequestEditAttributes = u.PredicateType<
  typeof isMergeRequestEditAttributes
>;

export const isMergeRequest = u.isObjectOf({
  id: u.isNumber,
  iid: u.isNumber,
  title: u.isString,
  description: u.isOneOf([u.isString, u.isNull]),
  target_branch: u.isString,
  source_branch: u.isString,
  draft: u.isBoolean,
  web_url: u.isString,
  squash: u.isBoolean,
  approved: u.isBoolean,
  assignees: u.isArrayOf(
    u.isObjectOf({
      username: u.isString,
      name: u.isString,
      ...u.isUnknown,
    }),
  ),
  reviewers: u.isArrayOf(
    u.isObjectOf({
      username: u.isString,
      name: u.isString,
      ...u.isUnknown,
    }),
  ),
  ...u.isUnknown,
});

export type MergeRequest = u.PredicateType<typeof isMergeRequest>;

const isMergeRequestApproveAttributes = u.isObjectOf({
  id: u.isNumber,
  merge_request_iid: u.isNumber,
  approval_password: u.isOptionalOf(u.isString),
  sha: u.isOptionalOf(u.isString),
  ...u.isUnknown,
});

export type MergeRequestApproveAttributes = u.PredicateType<
  typeof isMergeRequestApproveAttributes
>;

const isMergeRequestMergeAttributes = u.isObjectOf({
  id: u.isNumber,
  merge_request_iid: u.isNumber,
  merge_commit_message: u.isOptionalOf(u.isString),
  merge_when_pipeline_succeeds: u.isOptionalOf(u.isBoolean),
  sha: u.isOptionalOf(u.isString),
  should_remove_source_branch: u.isOptionalOf(u.isBoolean),
  squash_commit_message: u.isOptionalOf(u.isString),
  squash: u.isOptionalOf(u.isBoolean),
  ...u.isUnknown,
});

export type MergeRequestMergeAttributes = u.PredicateType<
  typeof isMergeRequestMergeAttributes
>;

export async function requestCreateMergeRequest(
  url: string,
  token: string,
  attrs: MergeRequestCreateAttributes,
): Promise<void> {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/merge_requests`;
  const res = await request(
    gitlabApiPath,
    token,
    "POST",
    JSON.stringify(attrs),
  );
  if (!(res.status == 201)) {
    throw new Error("Failed to create a new merge request.");
  }
}

export async function getProjectMergeRequests(
  url: string,
  token: string,
  attrs: MergeRequestGetAttributes,
): Promise<MergeRequest[]> {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/merge_requests`;
  const res = await request(gitlabApiPath, token, "GET");
  const mrs = await res.json();
  if (!u.isArrayOf(isMergeRequest)(mrs)) {
    throw new Error(`Failed to get merge requests. reason: ${mrs}`);
  }
  return mrs;
}

export async function requestEditMergeRequest(
  url: string,
  token: string,
  attrs: MergeRequestEditAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}`;
  const res = await request(
    gitlabApiPath,
    token,
    "PUT",
    JSON.stringify(attrs),
  );
  if (!(res.status == 200 || res.status == 201)) {
    throw new Error("Failed to edit a merge request.");
  }
}

export async function requestApproveMergeRequest(
  url: string,
  token: string,
  attrs: MergeRequestApproveAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/approve`;
  const res = await request(
    gitlabApiPath,
    token,
    "POST",
    JSON.stringify(attrs),
  );
  if (![200, 201].includes(res.status)) {
    throw new Error("Failed to approve a merge request.");
  }
}

export async function requestMergeMergeRequest(
  url: string,
  token: string,
  attrs: MergeRequestMergeAttributes,
): Promise<void> {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/merge`;
  const res = await request(gitlabApiPath, token, "PUT", JSON.stringify(attrs));
  if (![200, 201].includes(res.status)) {
    throw new Error("Failed to merge a merge request.");
  }
}

export async function getProjectMergeRequestsGraphQL(
  url: string,
  token: string,
  fullPath: string,
  projetId: number,
): Promise<MergeRequest[]> {
  const query = `
    query getMergeRequests($fullPath: ID!){
      project(fullPath: $fullPath) {
        mergeRequests {
          nodes {
            id
            iid
            title
            description
            targetBranch
            sourceBranch
            state
            approvedBy {
              nodes {
                id
                username
                name
              }
            }
            assignees {
              nodes {
                id
                username
                name
              }
            }
            reviewers {
              nodes {
                id
                username
                name
              }
            }
            draft
            webUrl
            squash
          }
        }
      }
    }
  `;
  const variables = { fullPath };
  const res = await request(
    `${url}/api/graphql`,
    token,
    "POST",
    JSON.stringify({ query, variables }),
  );
  const json = await res.json();
  const mrs = json.data.project.mergeRequests.nodes;
  const convertedMrs: MergeRequest[] = mrs.map((mr: {
    id: string;
    iid: string;
    title: string;
    description: string | null;
    targetBranch: string;
    sourceBranch: string;
    draft: boolean;
    webUrl: string;
    squash: boolean;
    state: string;
    approvedBy: {
      nodes: {
        username: string;
        name: string;
      }[];
    };
    assignees: {
      nodes: {
        username: string;
        name: string;
      }[];
    };
    reviewers: {
      nodes: {
        username: string;
        name: string;
      }[];
    };
  }) => {
    return {
      id: projetId,
      iid: Number(mr.iid),
      title: mr.title,
      description: mr.description,
      target_branch: mr.targetBranch,
      source_branch: mr.sourceBranch,
      draft: mr.draft,
      web_url: mr.webUrl,
      squash: mr.squash,
      state: mr.state,
      approved: mr.approvedBy.nodes.length > 0,
      assignees: mr.assignees.nodes.map((assignee) => {
        return {
          username: assignee.username,
          name: assignee.name,
        };
      }),
      reviewers: mr.reviewers.nodes.map((reviewer) => {
        return {
          username: reviewer.username,
          name: reviewer.name,
        };
      }),
    };
  });
  if (!u.isArrayOf(isMergeRequest)(convertedMrs)) {
    throw new Error(
      `Failed to get merge requests. reason: ${
        Deno.inspect(convertedMrs, { depth: Infinity })
      }`,
    );
  }
  return convertedMrs;
}
