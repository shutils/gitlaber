import { Denops, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    async createNewBranchMr(): Promise<void> {
      const { url, token, project } = await util.getCurrentGitlaberInstance(
        denops,
      );
      const currentNode = await util.getCurrentNode(denops);
      if (!("branch" in currentNode)) {
        helper.echoerr(denops, "This node is not branch.");
        return;
      }
      const currentBranch = currentNode.branch.name;
      const commitId = currentNode.branch.commit.short_id;
      const commit = await client.requestGetCommit(url, token, {
        id: project.id,
        sha: commitId,
      });
      const defaultTitle = commit.title;
      const defaultBranch = project.default_branch;
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
      try {
        await client.requestCreateMergeRequest(url, token, {
          id: project.id,
          title: title,
          source_branch: currentBranch,
          target_branch: terget,
        });
        helper.echo(denops, "Successfully created a new merge request.");
      } catch (e) {
        helper.echoerr(denops, e.message);
      }
    },
  };
}
