import { Denops, fn, helper, unknownutil as u } from "../../deps.ts";
import * as client from "../../client/index.ts";
import * as util from "../../util.ts";
import { getCurrentNode } from "../../core.ts";
import { executeRequest } from "./main.ts";
import { doAction } from "../main.ts";
import { getBufferInfo } from "../../command/buffer/main.ts";

export function main(denops: Denops): void {
  denops.dispatcher = {
    ...denops.dispatcher,
    "action:resource:issue:new": () => {
      doAction(denops, async (denops, ctx) => {
        const { project, url, token } = ctx.instance;
        const title = await helper.input(denops, {
          prompt: "New issue title: ",
        });
        if (!title) {
          return;
        }
        await executeRequest(
          denops,
          client.requestCreateNewProjectIssue,
          url,
          token,
          {
            id: project.id,
            title: title,
          },
          "Successfully created a new issue.",
          "issue",
        );
      });
    },

    "action:resource:issue:delete": () => {
      doAction(denops, async (denops, ctx) => {
        const { instance } = ctx;
        const currentNode = await getCurrentNode(denops, ctx);
        if (!(client.isIssue(currentNode.resource))) {
          helper.echo(denops, "This node is not an issue.");
          return;
        }
        const issue_iid = currentNode.resource.iid;
        const confirm = await helper.input(denops, {
          prompt:
            `Are you sure you want to delete the issue(${issue_iid})? y/N: `,
        });
        if (confirm !== "y") {
          return;
        }
        await executeRequest(
          denops,
          client.requestDeleteIssue,
          instance.url,
          instance.token,
          {
            id: instance.project.id,
            issue_iid: issue_iid,
          },
          "Successfully delete a issue.",
          "issue",
        );
      });
    },

    "action:resource:issue:state:toggle": () => {
      doAction(denops, async (denops, ctx) => {
        const { instance } = ctx;
        const currentNode = await getCurrentNode(denops, ctx);
        if (!(client.isIssue(currentNode.resource))) {
          helper.echo(denops, "This node is not an issue.");
          return;
        }
        const { iid, state } = currentNode.resource;
        let stateEvent: "close" | "reopen" = "close";
        if (state === "closed") {
          stateEvent = "reopen";
        }
        await executeRequest(
          denops,
          client.requestEditIssue,
          instance.url,
          instance.token,
          {
            id: instance.project.id,
            issue_iid: iid,
            state_event: stateEvent,
          },
          "Successfully toggle a issue state.",
          "issue",
        );
      });
    },

    "action:resource:issue:assign": () => {
      doAction(denops, async (denops, ctx) => {
        const { instance } = ctx;
        const currentNode = await getCurrentNode(denops, ctx);
        if (!(client.isIssue(currentNode.resource))) {
          helper.echo(denops, "This node is not an issue.");
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
        const { iid } = currentNode.resource;
        await executeRequest(
          denops,
          client.requestEditIssue,
          instance.url,
          instance.token,
          {
            id: instance.project.id,
            issue_iid: iid,
            assignee_ids: [members[labelIndex - 1].id],
          },
          "Successfully toggle a issue state.",
          "issue",
        );
      });
    },

    "action:resource:issue:label:add": () => {
      doAction(denops, async (denops, ctx) => {
        const { instance } = ctx;
        const currentNode = await getCurrentNode(denops, ctx);
        if (!(client.isIssue(currentNode.resource))) {
          helper.echo(denops, "This node is not an issue.");
          return;
        }
        const labels = await client.requestGetProjectLabels(
          instance.url,
          instance.token,
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
        const { iid } = currentNode.resource;
        const labelIndex = await fn.inputlist(denops, textlist.reverse());
        if (!labelIndex) {
          return;
        }
        await executeRequest(
          denops,
          client.requestEditIssue,
          instance.url,
          instance.token,
          {
            id: instance.project.id,
            issue_iid: iid,
            add_labels: labels[labelIndex - 1].name,
          },
          "Successfully add a issue label.",
          "issue",
        );
      });
    },

    "action:resource:issue:label:remove": () => {
      doAction(denops, async (denops, ctx) => {
        const { instance } = ctx;
        const currentNode = await getCurrentNode(denops, ctx);
        if (!(client.isIssue(currentNode.resource))) {
          helper.echo(denops, "This node is not an issue.");
          return;
        }
        const labels = currentNode.resource.labels;
        if (labels.length === 0) {
          helper.echo(denops, "This issue has not labels.");
          return;
        }
        const description = "Select the label number you want to remove.";
        const textlist: string[] = [description];
        for (let i = 0; i < labels.length; i++) {
          textlist.unshift(`${i + 1}. ${labels[i]}`);
        }
        const { iid } = currentNode.resource;
        const labelIndex = await fn.inputlist(denops, textlist.reverse());
        if (!labelIndex) {
          return;
        }
        await executeRequest(
          denops,
          client.requestEditIssue,
          instance.url,
          instance.token,
          {
            id: instance.project.id,
            issue_iid: iid,
            remove_labels: labels[labelIndex - 1],
          },
          "Successfully remove a issue label.",
          "issue",
        );
      });
    },

    "action:resource:issue:prev": () => {
      doAction(denops, async (denops, _ctx) => {
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "openProjectIssuePreview",
          [],
        ]);
      });
    },

    "action:resource:issue:edit": () => {
      doAction(denops, async (denops, _ctx) => {
        await fn.call(denops, "denops#notify", [
          "gitlaber",
          "openProjectIssueEditBuf",
          [],
        ]);
      });
    },

    "action:resource:issue:_edit": () => {
      doAction(denops, async (denops, ctx) => {
        const { project, url, token } = ctx.instance;
        const bufinfo = await getBufferInfo(denops);
        const description = await util.flattenBuffer(
          denops,
          await fn.bufname(denops),
        );
        const issue_iid = bufinfo.params?.user_input?.iid;
        if (!u.isNumber(issue_iid)) {
          return;
        }
        await executeRequest(
          denops,
          client.requestEditIssue,
          url,
          token,
          {
            id: project.id,
            issue_iid: issue_iid,
            description: description,
          },
          "Successfully edit a issue.",
          "issue",
        );
      });
    },
  };
}
