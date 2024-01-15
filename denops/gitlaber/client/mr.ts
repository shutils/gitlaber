import { unknownutil as u } from "../deps.ts";
import { request } from "./util.ts";

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

export async function requestCreateMergeRequest(
  url: string,
  token: string,
  attrs: {
    id: number;
    source_branch: string;
    target_branch: string;
    title: string;
    description?: string;
    assignee_id?: number;
    remove_source_branch?: boolean;
    squash?: boolean;
  },
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
  attrs: {
    id: number;
    approved?: "yes" | "no";
    assignee_id?: number;
    author_id?: number;
    author_username?: string;
    labels?: string;
  },
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
  attrs: {
    id: number;
    merge_request_iid: number;
    add_labels?: string;
    assignee_id?: number;
    assignee_ids?: number[];
    description?: string;
    labels?: string;
    remove_labels?: string;
    remove_source_branch?: boolean;
    reviewer_ids?: number[];
    squash?: boolean;
    state_event?: "close" | "reopen";
    target_branch?: string;
    title?: string;
  },
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
  attrs: {
    id: number;
    merge_request_iid: number;
    approval_password?: string;
    sha?: string;
  },
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
  attrs: {
    id: number;
    merge_request_iid: number;
    merge_commit_message?: string;
    merge_when_pipeline_succeeds?: boolean;
    sha?: string;
    should_remove_source_branch?: boolean;
    squash_commit_message?: string;
    squash?: boolean;
  },
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
