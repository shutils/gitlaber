import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";
import * as client from "../../client/index.ts";
import {
  Context,
  isBranch,
  isMergeRequest,
  Node,
} from "../../types.ts";
import * as util from "../../util.ts";
import { executeRequest } from "./core.ts";
import { doAction } from "../main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:resource:mr:new:relate:branch": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const branch = u.ensure(node.params, isBranch);
        const currentBranch = branch.name;
        const commitId = branch.commit.short_id;
        const commit = await client.getProjectCommit(
          url,
          token,
          {
            id: instance.project.id,
            sha: commitId,
          },
        );
        const defaultTitle = commit.title;
        const defaultBranch = instance.project.default_branch;
        const terget = await helper.input(denops, {
          prompt: "Terget branch: ",
          text: defaultBranch,
        });
        if (!terget) {
          return;
        }
        const title = await helper.input(denops, {
          prompt: "Merge request title: ",
          text: defaultTitle,
        });
        if (!title) {
          return;
        }
        const confirm = await helper.input(denops, {
          prompt:
            `Are you sure you want to create a merge request? (${currentBranch} into ${terget}) y/N: `,
        });
        if (confirm !== "y") {
          return;
        }
        executeRequest(
          denops,
          client.createProjectMergeRequest,
          url,
          token,
          {
            id: instance.project.id,
            title: title,
            source_branch: currentBranch,
            target_branch: terget,
          },
          "Successfully created a new merge request.",
        );
      });
    },

    "action:resource:mr:assign:assignee": () => {
      doAction(denops, async (args) => {
        await assignMergeRequestMember(args, "assignee");
      });
    },

    "action:resource:mr:assign:reviewer": () => {
      doAction(denops, async (args) => {
        await assignMergeRequestMember(args, "reviewer");
      });
    },

    "action:resource:mr:approve": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const mr = u.ensure(node.params, isMergeRequest);
        const confirm = await helper.input(denops, {
          prompt: `Are you sure you want to approve a merge request? y/N: `,
        });
        if (confirm !== "y") {
          return;
        }
        await executeRequest(
          denops,
          client.approveProjectMergeRequest,
          url,
          token,
          {
            id: instance.project.id,
            merge_request_iid: mr.iid,
          },
          "Successfully approve a merge request.",
        );
      });
    },

    "action:resource:mr:merge": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const mr = u.ensure(node.params, isMergeRequest);
        const confirm = await helper.input(denops, {
          prompt: `Are you sure you want to merge a merge request? y/N: `,
        });
        if (confirm !== "y") {
          return;
        }
        const remove_source_branch = await helper.input(denops, {
          prompt: `Do you want to remove the source branch? y/N: `,
        });
        const squash = await helper.input(denops, {
          prompt: `Do you want to squash? y/N: `,
        });
        let squash_commit_message: string | undefined;
        if (squash === "y") {
          const branch = await client.getProjectBranch(
            url,
            token,
            {
              id: instance.project.id,
              branch: mr.source_branch,
            },
          );
          const input = await helper.input(denops, {
            prompt: `Squash commit message: `,
            text: branch.commit.title,
          });
          squash_commit_message = input ?? undefined;
        }
        await executeRequest(
          denops,
          client.mergeProjectMergeRequest,
          url,
          token,
          {
            id: instance.project.id,
            merge_request_iid: mr.iid,
            should_remove_source_branch: remove_source_branch === "y",
            squash: squash === "y",
            squash_commit_message: squash_commit_message,
          },
          "Successfully merge a merge request.",
        );
      });
    },

    "action:resource:mr:prev": () => {
      doAction(denops, async (args) => {
        const { denops } = args;
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "command:buffer:open:resource:mr:prev",
          [],
        ]);
      });
    },
  };
}

async function assignMergeRequestMember(
  args: Context & { node: Node },
  role: "assignee" | "reviewer",
) {
  const { denops, instance, node, url, token } = args;
  const mr = u.ensure(node.params, isMergeRequest);
  const members = await client.getProjectMembers(url, token, {
    id: instance.project.id,
  });
  if (members.length === 0) {
    helper.echo(denops, "Project has not members.");
    return;
  }
  const description = "Select the member number you want to assign.";
  const contents: string[] = [];
  for (let i = 0; i < members.length; i++) {
    contents.unshift(`${i + 1}. ${members[i].name}`);
  }
  const labelIndex = await util.select(denops, contents, description);
  if (!labelIndex) {
    return;
  }
  let extraAttrs: object;
  if (role === "assignee") {
    extraAttrs = {
      assignee_id: members[labelIndex - 1].id,
    };
  } else {
    extraAttrs = {
      reviewer_ids: [members[labelIndex - 1].id],
    };
  }
  await executeRequest(
    denops,
    client.editProjectMergeRequest,
    url,
    token,
    {
      id: instance.project.id,
      merge_request_iid: mr.iid,
      ...extraAttrs,
    },
    "Successfully assine a member.",
  );
}
