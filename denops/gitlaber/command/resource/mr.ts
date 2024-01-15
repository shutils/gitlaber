import { autocmd, Denops, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import { getCtx, updateGitlaberInstanceRecentResource } from "../../core.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async assignMergeRequestAssignee(): Promise<void> {
      await assignMergeRequestMember(denops, "assignee");
    },

    async assignMergeRequestReviewer(): Promise<void> {
      await assignMergeRequestMember(denops, "reviewer");
    },

    async approveMergeRequest(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!("mr" in current_node)) {
        return;
      }
      const confirm = await helper.input(denops, {
        prompt: `Are you sure you want to approve a merge request? y/N: `,
      });
      if (confirm !== "y") {
        return;
      }
      await client.requestApproveMergeRequest(instance.url, instance.token, {
        id: instance.project.id,
        merge_request_iid: current_node.mr.iid,
      });
      await updateGitlaberInstanceRecentResource(denops, "merge_request");
      autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
    },

    async mergeMergeRequest(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!("mr" in current_node)) {
        return;
      }
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
          instance.url,
          instance.token,
          {
            id: instance.project.id,
            branch: current_node.mr.source_branch,
          },
        );
        const input = await helper.input(denops, {
          prompt: `Squash commit message: `,
          text: branch.commit.title,
        });
        squash_commit_message = input ?? undefined;
      }
      try {
        await client.requestMergeMergeRequest(instance.url, instance.token, {
          id: instance.project.id,
          merge_request_iid: current_node.mr.iid,
          should_remove_source_branch: remove_source_branch === "y",
          squash: squash === "y",
          squash_commit_message: squash_commit_message,
        });
        helper.echo(denops, "Successfully merge a merge request.");
        await updateGitlaberInstanceRecentResource(denops, "merge_request");
        autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },
  };
}

async function assignMergeRequestMember(
  denops: Denops,
  role: "assignee" | "reviewer",
) {
  const ctx = await getCtx(denops);
  const { current_node, instance } = ctx;
  if (!("mr" in current_node)) {
    return;
  }
  const members = await client.requestGetProjectMembers(
    instance.url,
    instance.token,
    {
      id: instance.project.id,
    },
  );
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
  const { iid } = current_node.mr;
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
  try {
    await client.requestEditMergeRequest(instance.url, instance.token, {
      id: instance.project.id,
      merge_request_iid: iid,
      ...extraAttrs,
    });
    helper.echo(denops, "Successfully assine a member.");
    await updateGitlaberInstanceRecentResource(denops, "merge_request");
    autocmd.emit(denops, "User", "GitlaberRecourceUpdate");
  } catch (e) {
    helper.echoerr(denops, e.message);
  }
}
