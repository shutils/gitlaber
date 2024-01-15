import { Denops, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import { getCtx } from "../../core.ts";
import { executeRequest } from "./main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async createNewBranchMr(): Promise<void> {
      const ctx = await getCtx(denops);
      const { current_node, instance } = ctx;
      if (!(client.isBranch(current_node.resource))) {
        helper.echo(denops, "This node is not a branch.");
        return;
      }
      const currentBranch = current_node.resource.name;
      const commitId = current_node.resource.commit.short_id;
      const commit = await client.requestGetCommit(
        instance.url,
        instance.token,
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
        client.requestCreateMergeRequest,
        instance.url,
        instance.token,
        {
          id: instance.project.id,
          title: title,
          source_branch: currentBranch,
          target_branch: terget,
        },
        "Successfully created a new merge request.",
        "merge_request",
      );
    },
  };
}
