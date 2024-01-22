import { Denops, helper, unknownutil as u } from "../../deps.ts";
import * as client from "../../client/index.ts";
import { isIssue } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { doAction } from "../main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:resource:branch:new:relate:issue": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const issue = u.ensure(node.params, isIssue);
        const defaultBranch = instance.project.default_branch;
        const title = issue.title;
        const issue_iid = issue.iid;
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
        await executeRequest(denops, client.createProjectBranch, url, token, {
          id: instance.project.id,
          branch: branch,
          ref: ref,
        }, "Successfully create a new branch.");
      });
    },
  };
}
