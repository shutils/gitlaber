import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";

import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import { isIssue } from "../../types.ts";
import { executeRequest } from "./core.ts";
import { doAction } from "../main.ts";
import { flattenBuffer } from "../../util.ts";
import {
  getBuffer,
  getCurrentInstance,
  getGitlabToken,
  getGitlabUrl,
} from "../../helper.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:resource:issue:new": () => {
      doAction(denops, async (args) => {
        const { url, token } = args;
        const project = args.instance.project;
        const title = await helper.input(denops, {
          prompt: "New issue title: ",
        });
        if (!title) {
          return;
        }
        await executeRequest(
          denops,
          client.createProjectIssue,
          url,
          token,
          {
            id: project.id,
            title: title,
          },
          "Successfully created a new issue.",
        );
      });
    },

    "action:resource:issue:delete": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const issue = u.ensure(node.params, isIssue);
        const confirm = await helper.input(denops, {
          prompt:
            `Are you sure you want to delete the issue(${issue.iid})? y/N: `,
        });
        if (confirm !== "y") {
          return;
        }
        await executeRequest(
          denops,
          client.deleteProjectIssue,
          url,
          token,
          {
            id: instance.project.id,
            issue_iid: issue.iid,
          },
          "Successfully delete a issue.",
        );
      });
    },

    "action:resource:issue:state:toggle": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const issue = u.ensure(node.params, isIssue);
        let stateEvent: "close" | "reopen" = "close";
        if (issue.state === "closed") {
          stateEvent = "reopen";
        }
        await executeRequest(
          denops,
          client.editProjectIssue,
          url,
          token,
          {
            id: instance.project.id,
            issue_iid: issue.iid,
            state_event: stateEvent,
          },
          "Successfully toggle a issue state.",
        );
      });
    },

    "action:resource:issue:assign": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const issue = u.ensure(node.params, isIssue);
        const members = await client.getProjectMembers(
          url,
          token,
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
        await executeRequest(
          denops,
          client.editProjectIssue,
          url,
          token,
          {
            id: instance.project.id,
            issue_iid: issue.iid,
            assignee_ids: [members[labelIndex - 1].id],
          },
          "Successfully toggle a issue state.",
        );
      });
    },

    "action:resource:issue:label:add": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const issue = u.ensure(node.params, isIssue);
        const labels = await client.getProjectLabels(
          url,
          token,
          {
            id: instance.project.id,
          },
        );
        if (labels.length === 0) {
          helper.echo(denops, "Project has not labels.");
          return;
        }
        const description = "Select the label number you want to add.";
        const textlist: string[] = [description];
        for (let i = 0; i < labels.length; i++) {
          textlist.unshift(`${i + 1}. ${labels[i].name}`);
        }
        const labelIndex = await fn.inputlist(denops, textlist.reverse());
        if (!labelIndex) {
          return;
        }
        await executeRequest(
          denops,
          client.editProjectIssue,
          url,
          token,
          {
            id: instance.project.id,
            issue_iid: issue.iid,
            add_labels: labels[labelIndex - 1].name,
          },
          "Successfully add a issue label.",
        );
      });
    },

    "action:resource:issue:label:remove": () => {
      doAction(denops, async (args) => {
        const { instance, node, url, token } = args;
        const issue = u.ensure(node.params, isIssue);
        const labels = issue.labels;
        if (labels.length === 0) {
          helper.echo(denops, "This issue has not labels.");
          return;
        }
        const description = "Select the label number you want to remove.";
        const textlist: string[] = [description];
        for (let i = 0; i < labels.length; i++) {
          textlist.unshift(`${i + 1}. ${labels[i]}`);
        }
        const labelIndex = await fn.inputlist(denops, textlist.reverse());
        if (!labelIndex) {
          return;
        }
        await executeRequest(
          denops,
          client.editProjectIssue,
          url,
          token,
          {
            id: instance.project.id,
            issue_iid: issue.iid,
            remove_labels: labels[labelIndex - 1],
          },
          "Successfully remove a issue label.",
        );
      });
    },

    "action:resource:issue:prev": () => {
      doAction(denops, async (args) => {
        const { denops } = args;
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "command:buffer:open:resource:issue:prev",
          [],
        ]);
      });
    },

    "action:resource:issue:edit": () => {
      doAction(denops, async (args) => {
        const { denops } = args;
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "command:buffer:open:resource:issue:edit",
          [],
        ]);
      });
    },
    "action:resource:issue:_edit": async () => {
      const instance = await getCurrentInstance(denops);
      const url = getGitlabUrl(instance.cwd);
      const token = getGitlabToken(instance.cwd);
      const description = await flattenBuffer(
        denops,
        await fn.bufname(denops),
      );
      const buffer = await getBuffer(denops, await fn.bufnr(denops));
      const params = buffer?.params;
      if (
        !u.isObjectOf({
          iid: u.isNumber,
        })(params)
      ) {
        helper.echo(denops, "Iid has not been set.");
        return;
      }
      const issue_iid = params.iid;
      if (!u.isNumber(issue_iid)) {
        return;
      }
      await executeRequest(
        denops,
        client.editProjectIssue,
        url,
        token,
        {
          id: instance.project.id,
          issue_iid: issue_iid,
          description: description,
        },
        "Successfully edit a issue.",
      );
    },
  };
}
