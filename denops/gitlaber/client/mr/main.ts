import { unknownutil as u } from "../../deps.ts";
import { request } from "../core.ts";
import { isMergeRequest, MergeRequest } from "./types.ts";

export async function createProjectMergeRequest(
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
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/merge_requests`;
  await request(gitlabApiPath, token, "POST", JSON.stringify(attrs));
}

export async function getProjectMergeRequest(
  url: string,
  token: string,
  attrs: {
    id: number;
    merge_request_iid: number;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}`;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    isMergeRequest,
  );
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
) {
  const gitlabApiPath = `${url}/api/v4/projects/${attrs.id}/merge_requests`;
  return u.ensure(
    await request(gitlabApiPath, token, "GET"),
    u.isArrayOf(isMergeRequest),
  );
}

export async function editProjectMergeRequest(
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
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}`;
  await request(gitlabApiPath, token, "PUT", JSON.stringify(attrs));
}

export async function approveProjectMergeRequest(
  url: string,
  token: string,
  attrs: {
    id: number;
    merge_request_iid: number;
    approval_password?: string;
    sha?: string;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/approve`;
  await request(gitlabApiPath, token, "POST", JSON.stringify(attrs));
}

export async function unapproveProjectMergeRequest(
  url: string,
  token: string,
  attrs: {
    id: number;
    merge_request_iid: number;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/unapprove`;
  await request(gitlabApiPath, token, "POST");
}

export async function mergeProjectMergeRequest(
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
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}/merge`;
  await request(gitlabApiPath, token, "PUT", JSON.stringify(attrs));
}

export async function deleteProjectMergeRequest(
  url: string,
  token: string,
  attrs: {
    id: number;
    merge_request_iid: number;
  },
) {
  const gitlabApiPath =
    `${url}/api/v4/projects/${attrs.id}/merge_requests/${attrs.merge_request_iid}`;
  await request(gitlabApiPath, token, "DELETE");
}

export async function getProjectMergeRequestsGraphQL(
  url: string,
  token: string,
  fullPath: string,
  projetId: number,
) {
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
  const json = await request(
    `${url}/api/graphql`,
    token,
    "POST",
    JSON.stringify({ query, variables }),
  );
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
  return u.ensure(convertedMrs, u.isArrayOf(isMergeRequest));
}
