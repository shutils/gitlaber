import { Denops, helper } from "../../deps.ts";
import * as client from "../../client/index.ts";
import { getCurrentNode } from "../../core.ts";
import { executeRequest } from "./core.ts";
import { doAction } from "../main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:resource:branch:new:relate:issue": () => {
      doAction(denops, async (denops, ctx) => {
        const { instance } = ctx;
        const currentNode = await getCurrentNode(denops, ctx);
        if (!(client.isIssue(currentNode.resource))) {
          helper.echo(denops, "This node is not an issue.");
          return;
        }
        const defaultBranch = instance.project.default_branch;
        const title = currentNode.resource.title;
        const issue_iid = currentNode.resource.iid;
        const branch = await helper.input(denops, {
          prompt: "New branch name: ",
          text: `${issue_iid}-${title}`,
        });
        if (!branch) {
          return;
        }
        const ref = await helper.input(denops, {
          prompt: "Ref branch name: ",
          text: defaultBranch,
        });
        if (!ref) {
          return;
        }
        await executeRequest(
          denops,
          client.requestCreateIssueBranch,
          instance.url,
          instance.token,
          {
            id: instance.project.id,
            branch: branch,
            ref: ref,
          },
          "Successfully create a new branch.",
          "branch",
        );
      });
    },
  };
}
